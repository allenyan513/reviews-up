import { MiddlewareConsumer, Module } from '@nestjs/common';

import { LinksModule } from './modules/links/links.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { UsersModule } from './modules/users/users.module';
import { FormsModule } from './modules/forms/forms.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WidgetsModule } from './modules/widgets/widgets.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthFilterMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    EmailModule,
    PrismaModule,
    LinksModule,
    WorkspacesModule,
    UsersModule,
    FormsModule,
    ReviewsModule,
    WidgetsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthFilterMiddleware).forRoutes('*');
  }
}
