import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { ProductsService } from '@src/modules/products/products.service';
import {
  CreateProductRequest,
  findAllRequestSchema,
  SubmitProductRequest,
  UpdateProductRequest,
} from '@reviewsup/api/products';
import { RRResponse } from '@reviewsup/api/common';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Jwt() jwt: JwtPayload, @Body() request: CreateProductRequest) {
    return this.productsService.create(jwt.userId, request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submit(@Jwt() jwt: JwtPayload, @Body() request: SubmitProductRequest) {
    return this.productsService.submit(jwt.userId, request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('taskReviewCount')
  async getTaskReviewCount(uid: string): Promise<RRResponse<number>> {
    return this.productsService.getTaskReviewCount(uid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('crawl')
  async crawlProductInfo(@Jwt() jwt: JwtPayload, @Body('url') url: string) {
    return this.productsService.crawlProductInfo(jwt.userId, url);
  }

  @UseGuards(JwtAuthGuard)
  @Post('findAll')
  async findAll(@Jwt() jwt: JwtPayload, @Body() request: any) {
    const validatedRequest = findAllRequestSchema.parse(request);
    return this.productsService.findAll(jwt.userId, validatedRequest);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':id/badge.svg')
  async getBadgeSvgById(
    @Param('id') id: string,
    @Query('theme') theme: 'light' | 'dark' = 'light',
    @Res() res: Response,
  ) {
    const svgContent = await this.productsService.generateProductBadgeSvg(
      id,
      theme,
    );
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.send(svgContent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verify(@Body('url') url: string) {
    const targets = [process.env.NEXT_PUBLIC_WWW_URL];
    return this.productsService.verifyEmbedCode(targets, url);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateProductRequest,
  ) {
    return this.productsService.update(jwt.userId, id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.productsService.remove(jwt.userId, id);
  }

  @Post('public/list')
  async publicList(@Body() request: any) {
    const validatedRequest = findAllRequestSchema.parse(request);
    return this.productsService.findAll(null, validatedRequest);
  }

  @Get('public/slug/:slug')
  async publicSlug(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }
}
