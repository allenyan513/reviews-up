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
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import {
  findAllReviewRequestSchema,
  FindAllReviewRequest,
  CreateReviewDto,
  UpdateReviewDto,
} from '@reviewsup/api/reviews';
import { YtDlpService } from '../yt-dlp/yt-dlp.service';
import { YtDlpRequest } from '@reviewsup/api/yt-dlp';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private ytdlpService: YtDlpService,
  ) {}

  @Post('submit')
  async submit(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(null, createReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Jwt() jwt: JwtPayload,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(jwt.userId, createReviewDto);
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

  @UseGuards(JwtAuthGuard)
  @Post('parse')
  async parse(@Jwt() jwt: JwtPayload, @Body() request: YtDlpRequest) {
    return this.ytdlpService.parse(request);
  }
}
