import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ProductsService } from '../products/products.service';
import { ShowcasesService } from '../showcases/showcases.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, ProductsService, ShowcasesService],
})
export class ReviewsModule {}
