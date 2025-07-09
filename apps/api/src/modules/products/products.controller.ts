import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { ProductsService } from '@src/modules/products/products.service';
import {
  CreateProductRequest,
  findAllRequestSchema,
  UpdateProductRequest
} from '@reviewsup/api/products';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('crawl')
  // async crawl(@Jwt() jwt: JwtPayload, @Body() request: CreateProductRequest) {
  //   return this.productsService.crawl(jwt.userId, request);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Jwt() jwt: JwtPayload, @Body() request: CreateProductRequest) {
    return this.productsService.create(jwt.userId, request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('findAll')
  async findAll(@Jwt() jwt: JwtPayload, @Body() request: any) {
    const validatedRequest = findAllRequestSchema.parse(request);
    return this.productsService.findAll(jwt.userId, validatedRequest);
  }

  //查询全部已经评价过的form

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateProductRequest
  ) {
    return this.productsService.update(jwt.userId, id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.productsService.remove(jwt.userId, id);
  }



}
