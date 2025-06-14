import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from '@repo/api/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api/reviews/dto/update-review.dto';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/common/types/jwt-payload';
import {
  findAllReviewRequestSchema,
  FindAllReviewRequest,
} from '@repo/api/reviews/dto/find-all-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Jwt() jwt: JwtPayload,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(jwt.userId, createReviewDto);
  }

  @Post('submit')
  async submit(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.submit(createReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('workspaceId/:workspaceId')
  async findAll(
    @Jwt() jwt: JwtPayload,
    @Param('workspaceId') workspaceId: string,
    @Query() query: any,
  ) {
    const input = findAllReviewRequestSchema.parse({
      userId: jwt.userId,
      workspaceId,
      ...query,
    }) as FindAllReviewRequest;
    return this.reviewsService.findAll(input);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(jwt.userId, id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.reviewsService.remove(jwt.userId, id);
  }
}
