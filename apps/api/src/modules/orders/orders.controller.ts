import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  RawBodyRequest,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import {
  CreateOneTimePaymentDto,
  UpdateOrderDto,
} from '@reviewsup/api/orders';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { Jwt } from '../auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('products')
  async getProducts(@Jwt() jwt: JwtPayload) {
    return this.ordersService.getProducts(jwt.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Jwt() jwt: JwtPayload, @Body() dto: CreateOneTimePaymentDto) {
    return this.ordersService.createOneTimePayment(jwt.userId, dto);
  }

  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    try {
      await this.ordersService.stripeWebhookInner(sig, req.rawBody);
      res.status(HttpStatus.OK).send();
    } catch (err) {
      this.logger.error(`Webhook Error: ${err}`);
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Jwt() jwt: JwtPayload) {
    return this.ordersService.findAll(jwt.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.ordersService.findOne(jwt.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(jwt.userId, id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.ordersService.remove(jwt.userId, id);
  }
}
