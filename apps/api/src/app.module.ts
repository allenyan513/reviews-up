import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { UsersModule } from './modules/users/users.module';
import { FormsModule } from './modules/forms/forms.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ShowcasesModule } from './modules/showcases/showcases.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { S3Module } from './modules/s3/s3.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { NotificationsModule } from '@src/modules/notifications/notifications.module';
import { YtDlpModule } from '@src/modules/yt-dlp/yt-dlp.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES || '1h',
      },
    }),
    ScheduleModule.forRoot(),
    PassportModule,
    EmailModule,
    PrismaModule,
    WorkspacesModule,
    UsersModule,
    FormsModule,
    ReviewsModule,
    ShowcasesModule,
    AuthModule,
    S3Module,
    NotificationsModule,
    YtDlpModule,
    CampaignsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
