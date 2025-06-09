import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShowcasesService } from './showcases.service';
import { CreateShowcaseDto } from '@repo/api/showcases/dto/create-showcase.dto';
import { UpdateShowcaseDto } from '@repo/api/showcases/dto/update-showcase.dto';
import { Uid } from '../../middleware/uid.decorator';

@Controller('showcases')
export class ShowcasesController {
  constructor(private readonly showcasesService: ShowcasesService) {}


  /** Public endpoints for showcases */

  @Get('shortId/:shortId')
  async findOneByShortId(@Param('shortId') shortId: string) {
    return this.showcasesService.findOneByShortId(shortId);
  }

  @Post()
  async create(@Uid() uid: string, @Body() createShowcaseDto: CreateShowcaseDto) {
    return this.showcasesService.create(uid, createShowcaseDto);
  }

  @Get('workspaceId/:workspaceId')
  findAll(
    @Uid() uid: string,
    @Param('workspaceId') workspaceId: string,
    @Param('page') page: number = 1,
    @Param('pageSize') pageSize: number = 10,
    @Param('sortBy') sortBy: string = 'createdAt',
    @Param('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return this.showcasesService.findAll(uid, workspaceId, {
      page,
      pageSize,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  async findOne(@Uid() uid: string, @Param('id') id: string) {
    return this.showcasesService.findOne(uid, id);
  }


  @Patch(':id')
  async update(
    @Uid() uid: string,
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcasesService.update(uid, id, updateShowcaseDto);
  }

  @Delete(':id')
  async remove(@Uid() uid: string, @Param('id') id: string) {
    return this.showcasesService.remove(uid, id);
  }


}
