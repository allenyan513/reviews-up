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

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Uid() uid: string, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(uid, createReviewDto);
  }

  @Get('workspaceId/:workspaceId')
  async findAll(@Uid() uid: string, @Param('workspaceId') workspaceId: string) {
    return this.reviewsService.findAll(workspaceId);
  }

  @Get(':id')
  async findOne(@Uid() uid: string, @Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Uid() uid: string,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(uid, id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Uid() uid: string, @Param('id') id: string) {
    return this.reviewsService.remove(uid, id);
  }
}
