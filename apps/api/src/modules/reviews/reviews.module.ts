import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ProductsService } from '../products/products.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, ProductsService],
})
export class ReviewsModule {}
