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
import { ShowcasesService } from './showcases.service';
import { CreateShowcaseDto, UpdateShowcaseDto } from '@repo/api/showcases';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';

@Controller('showcases')
export class ShowcasesController {
  constructor(private readonly showcasesService: ShowcasesService) {}

  /** Public endpoints for showcases */

  @Get('shortId/:shortId')
  async findOneByShortId(@Param('shortId') shortId: string) {
    return this.showcasesService.findOneByShortId(shortId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.showcasesService.findOne(jwt.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Jwt() jwt: JwtPayload,
    @Body() createShowcaseDto: CreateShowcaseDto,
  ) {
    return this.showcasesService.create(jwt.userId, createShowcaseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('workspaceId/:workspaceId')
  findAll(
    @Jwt() jwt: JwtPayload,
    @Param('workspaceId') workspaceId: string,
    @Param('page') page: number = 1,
    @Param('pageSize') pageSize: number = 10,
    @Param('sortBy') sortBy: string = 'createdAt',
    @Param('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.showcasesService.findAll(jwt.userId, workspaceId, {
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
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcasesService.update(jwt.userId, id, updateShowcaseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.showcasesService.remove(jwt.userId, id);
  }
}
