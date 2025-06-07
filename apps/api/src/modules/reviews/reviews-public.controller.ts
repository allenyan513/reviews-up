import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api/reviews/dto/update-review.dto';
import { Uid } from '../../middleware/uid.decorator';

@Controller('reviews/public')
export class ReviewsPublicController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createPublic(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createPublic(createReviewDto);
  }
}
