import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  UpdateOrderDto,
  OrderStatus,
  PaymentStatus,
  CreateOrderDto,
  CreatePaymentEventDto,
  CreateOneTimePaymentDto,
  CreateOneTimePaymentResponse,
} from '@reviewsup/api/orders';
import { $Enums } from '@reviewsup/database/generated/client';
import PaymentStatusInPrisma = $Enums.PaymentStatus;
import OrderStatusInPrisma = $Enums.OrderStatus;

import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { EMAIL_FROM } from '../email/email.constants';
import { UsersService } from '@src/modules/users/users.service';
import Stripe from 'stripe';
import { Decimal } from '@reviewsup/database/generated/client/runtime/library';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private stripe: Stripe;

  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
    private userService: UsersService,
  ) {
    this.stripe = new Stripe(`${process.env.STRIPE_KEY}`, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async getProducts(uid: string): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list({
        limit: 3,
      });
      for (const product of products.data) {
        if (!product.default_price) {
          continue;
        }
        const price = await this.stripe.prices.retrieve(
          product.default_price as string,
        );
        if (price) {
          product['price'] = price;
        }
      }
      return products.data;
    } catch (error) {
      this.logger.error('Error fetching products:', error);
      throw new BadRequestException('Failed to fetch products');
    }
  }

  private async fetchStripeCustomer(customerEmail: string) {
    let customer: Stripe.Customer;
    const stripeCustomers = await this.stripe.customers.list({
      email: customerEmail,
    });
    if (!stripeCustomers.data.length) {
      this.logger.log('creating customer');
      customer = await this.stripe.customers.create({
        email: customerEmail,
      });
    } else {
      this.logger.log('using existing customer');
      customer = stripeCustomers.data[0];
    }
    return customer;
  }

  private async createStripeCheckoutSession(
    productId: string,
    customerId: string,
    userId: string,
  ) {
    const product = await this.stripe.products.retrieve(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const defaultPriceId = product.default_price as string | undefined;
    if (!defaultPriceId) {
      throw new BadRequestException('Default price not found for product');
    }
    const price = await this.stripe.prices.retrieve(defaultPriceId);
    if (!price) {
      throw new BadRequestException('Price not found for product');
    }
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: defaultPriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.STRIPE_CHECKOUT_SUCCESS_URL}`,
      cancel_url: `${process.env.STRIPE_CHECKOUT_CANCEL_URL}`,
      customer: customerId,
    });
    if (!session || !session.id) {
      throw new BadRequestException('Failed to create Stripe session');
    }
    const order = await this.create({
      sessionId: session.id,
      userId: userId,
      productId: productId,
      product: product,
      priceId: defaultPriceId,
      price: price,
    });
    if (!order) {
      throw new BadRequestException('Failed to create order');
    }
    return session;
  }

  /**
   * Create a one-time payment session
   * @param uid
   * @param dto
   *
   */
  async createOneTimePayment(uid: string, dto: CreateOneTimePaymentDto) {
    this.logger.debug('createOneTimePayment', uid, dto);
    const userProfile = await this.userService.getUserByUid(uid);
    if (!userProfile) {
      throw new BadRequestException('User not found');
    }
    try {
      const customer = await this.fetchStripeCustomer(userProfile.email);
      const session = await this.createStripeCheckoutSession(
        dto.productId,
        customer.id,
        userProfile.id,
      );
      return {
        sessionUrl: session.url,
        sessionId: session.id,
      } as CreateOneTimePaymentResponse;
    } catch (error: any) {
      this.logger.error(error);
      throw new BadRequestException(
        `Failed to create one-time payment session: ${error.message}`,
      );
    }
  }

  async stripeWebhookInner(sig: string, payload: string | Buffer | undefined) {
    const event: Stripe.Event = this.stripe.webhooks.constructEvent(
      payload as string | Buffer,
      sig,
      `${process.env.STRIPE_WEBHOOK_SECRET}`,
    );
    if (!event) {
      throw new BadRequestException('Stripe event is undefined');
    }
    await this.createPaymentEvent({
      eventId: event.id,
      eventType: event.type,
      data: event.data.object as any,
    });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const sessionId = session.id;
      const paymentStatus = session.payment_status;
      if (paymentStatus === PaymentStatus.paid) {
        const order = await this.findOneBySessionId(sessionId);
        if (order && order.paymentStatus === PaymentStatus.paid) {
          this.logger.log(`Order ${order.id} already paid`);
          return { received: true };
        }
        if (!order) {
          this.logger.warn(`Order not found for sessionId: ${sessionId}`);
          return { received: true };
        }
        this.logger.log(`Order ${order?.id} is being paid`);
        const amountTotal = session.amount_total;
        const amountSubtotal = session.amount_subtotal;
        const currency = session.currency;
        await this.updatePaid(sessionId, {
          amount_total: amountTotal,
          amount_subtotal: amountSubtotal,
          currency: currency,
        });
      } else if (
        paymentStatus === PaymentStatus.unpaid ||
        paymentStatus === PaymentStatus.noPaymentRequired
      ) {
        this.logger.log(`Order ${sessionId} is unpaid or no payment required`);
        // await this.orderService.updateUnpaid(sessionId, event.data.object as any);
      } else {
        this.logger.warn(`Unhandled payment status: ${paymentStatus}`);
      }
    } else {
      this.logger.debug(`Unhandled event type ${event.type}`);
    }
    return {
      received: true,
    };
  }

  async getProduct(productId: string) {
    return await this.stripe.products.retrieve(productId,{
      expand: ['default_price'],
    });
  }
  async getProductPrice(productId: string) {
    const product = await this.stripe.products.retrieve(productId);
    this.logger.debug('default_price', product.default_price);
    if (!product.default_price) {
      throw new BadRequestException('Default price not found for product');
    }
    const price =  await this.stripe.prices.retrieve(
      product.default_price as string,
    );
    if (!price) {
      throw new BadRequestException('Price not found for product');
    }
    return price;
  }
  async getProductPriceDecimal(productId: string) {
    const price = await this.getProductPrice(productId);
    if (!price.unit_amount) {
      throw new BadRequestException('Price unit amount not found');
    }
    return new Decimal(price.unit_amount / 100).toFixed(2);
  }

  async create(dto: CreateOrderDto) {
    const order = await this.prismaService.order.create({
      data: {
        sessionId: dto.sessionId,
        userId: dto.userId,
        productId: dto.productId,
        product: dto.product,
        priceId: dto.priceId,
        price: dto.price,
        paymentStatus: PaymentStatusInPrisma.pending,
        orderStatus: OrderStatusInPrisma.pending,
      },
    });
    return order;
  }

  async createPaymentEvent(dto: CreatePaymentEventDto) {
    return this.prismaService.paymentEvent.create({
      data: {
        evnetId: dto.eventId,
        eventType: dto.eventType,
        data: dto.data,
      },
    });
  }

  async findAll(uid: string) {
    return this.prismaService.order.findMany({
      where: { userId: uid },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneBySessionId(sessionId: string) {
    const order = await this.prismaService.order.findUnique({
      where: { sessionId: sessionId },
    });
    if (!order) {
      throw new Error(`Order with sessionId ${sessionId} not found`);
    }
    return order;
  }

  /**
   * 订单支付成功后更新订单状态和数据
   * @param sessionId
   * @param json
   */
  async updatePaid(
    sessionId: string,
    {
      amount_total,
      amount_subtotal,
      currency,
    }: {
      amount_total: number;
      amount_subtotal: number;
      currency: string;
    },
  ) {
    //更新订单状态为已支付
    const order = await this.prismaService.order.update({
      where: { sessionId: sessionId },
      data: {
        paymentStatus: PaymentStatusInPrisma.paid,
      },
      include: {
        user: true,
      },
    });
    if (!order) {
      throw new Error(`Order with sessionId ${sessionId} not found`);
    }
    // 计算金额
    const amountSubtotal = new Decimal(amount_subtotal / 100).toFixed(2);
    //更新用户余额
    await this.prismaService.user.update({
      where: { id: order.userId },
      data: {
        subscriptionTier: 'pro',
        balance: {
          increment: amountSubtotal,
        },
      },
    });
    //发送邮件通知
    const userEmail = order.user.email;
    await this.emailService.send({
      from: EMAIL_FROM,
      to: [userEmail],
      subject: `Order Payment Successful - ${order.id}`,
      text: `Your order with ID ${order.id} has been successfully paid.`,
    });
    return order;
  }

  async findOne(uid: string, id: string) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: id,
        userId: uid,
      },
    });
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    return order;
  }

  async update(uid: string, id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prismaService.order.update({
      where: {
        id: id,
        userId: uid, // Ensure the order belongs to the user
      },
      data: {
        //todo what fields to update?
      },
    });
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    return order;
  }

  async remove(uid: string, id: string) {
    const order = await this.prismaService.order.delete({
      where: {
        id: id,
        userId: uid, // Ensure the order belongs to the user
      },
    });
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    return order;
  }
}
