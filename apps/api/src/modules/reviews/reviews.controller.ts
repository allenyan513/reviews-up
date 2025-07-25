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
  createReviewSchema,
} from '@reviewsup/api/reviews';
import { YtDlpService } from '../yt-dlp/yt-dlp.service';
import { YtDlpRequest } from '@reviewsup/api/yt-dlp';
import {
  TiktokOembedRequest,
  tiktokOembedRequestShema,
} from '@reviewsup/api/tiktok';
import { GoogleMapRequest } from '@reviewsup/api/google';

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
    const validatedDto = createReviewSchema.parse(
      createReviewDto,
    ) as CreateReviewDto;
    return this.reviewsService.create(jwt.userId, validatedDto);
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
  @Patch(':id/status')
  async updateStatus(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateStatus(jwt.userId, id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/pin')
  async updatePin(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updatePin(jwt.userId, id, updateReviewDto);
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

  @UseGuards(JwtAuthGuard)
  @Post('parse/tiktok')
  async parseTiktok(
    @Jwt() jwt: JwtPayload,
    @Body() request: TiktokOembedRequest,
  ) {
    const validatedRequest = tiktokOembedRequestShema.parse(
      request,
    ) as TiktokOembedRequest;
    return this.reviewsService.parseTiktok(validatedRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post('parse/google')
  async searchPlaces(
    @Jwt() jwt: JwtPayload,
    @Body() request: GoogleMapRequest,
  ) {
    return await this.reviewsService.searchPlaces(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Jwt() jwt: JwtPayload, @Query() query: any) {
    const input = findAllReviewRequestSchema.parse({
      ...query,
    }) as FindAllReviewRequest;
    return this.reviewsService.findAll(jwt.userId, input);
  }
}
