import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { ProductsService } from './products.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '@src/modules/email/email.module';
import { PrismaModule } from '@src/modules/prisma/prisma.module';
import { UsersModule } from '@src/modules/users/users.module';
import { FormsModule } from '@src/modules/forms/forms.module';
import { ReviewsModule } from '@src/modules/reviews/reviews.module';
import { WidgetsModule } from '@src/modules/widgets/widgets.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { S3Module } from '@src/modules/s3/s3.module';
import { NotificationsModule } from '@src/modules/notifications/notifications.module';
import { YtDlpModule } from '@src/modules/yt-dlp/yt-dlp.module';
import { CampaignsModule } from '@src/modules/campaigns/campaigns.module';
import { AnalyticsModule } from '@src/modules/analytics/analytics.module';
import { ProductsModule } from '@src/modules/products/products.module';
import { OrdersModule } from '@src/modules/orders/orders.module';
import { BrowserlessModule } from '@src/modules/browserless/browserless.module';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        PassportModule,
        EmailModule,
        PrismaModule,
        UsersModule,
        FormsModule,
        ReviewsModule,
        WidgetsModule,
        AuthModule,
        S3Module,
        NotificationsModule,
        YtDlpModule,
        CampaignsModule,
        AnalyticsModule,
        ProductsModule,
        OrdersModule,
        BrowserlessModule,
      ],
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should', async () => {
    const targets = ['https://www.reviewsup.io', 'https://reviewsup.io'];
    const url = 'https://copyber.com/';
    const exist = await service.verifyEmbedCode(targets, url);
    console.log(exist);
  }, 10000);
});
