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
  findAllWidgetSchema,
} from '@reviewsup/api/widgets';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

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
  @Post('findAll')
  findAll(@Jwt() jwt: JwtPayload, @Body() request: any) {
    const validateRequest = findAllWidgetSchema.parse(request);
    return this.widgetsService.findAll(jwt.userId, validateRequest);
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
