import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import {
  CreateWidgetDto,
  UpdateWidgetDto,
  verifyWidgetEmbeddingSchema,
} from '@reviewsup/api/widgets';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verify(@Jwt() jwt: JwtPayload, @Body() request: any) {
    const validatedRequest = verifyWidgetEmbeddingSchema.parse(request);
    return this.widgetsService.verifyWidgetEmbedding(
      jwt.userId,
      validatedRequest,
    );
  }

  @Get('shortId/:shortId')
  async findOneByShortId(@Param('shortId') shortId: string) {
    return this.widgetsService.findOneByShortId(shortId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.widgetsService.findOne(jwt.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Jwt() jwt: JwtPayload, @Body() dto: CreateWidgetDto) {
    return this.widgetsService.create(jwt.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('productId/:productId')
  findAll(
    @Jwt() jwt: JwtPayload,
    @Param('productId') productId: string,
    @Param('page') page: number = 1,
    @Param('pageSize') pageSize: number = 10,
    @Param('sortBy') sortBy: string = 'createdAt',
    @Param('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.widgetsService.findAll(jwt.userId, productId, {
      page,
      pageSize,
      sortBy,
      sortOrder,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWidgetDto,
  ) {
    return this.widgetsService.update(jwt.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.widgetsService.remove(jwt.userId, id);
  }
}
