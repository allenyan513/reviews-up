import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from '@repo/api/forms/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/forms/dto/update-form.dto';
import { Uid } from 'src/middleware/uid.decorator';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('')
  create(@Uid() uid: string, @Body() createFormDto: CreateFormDto) {
    return this.formsService.create(uid, createFormDto);
  }

  @Get('')
  findAll(@Uid() uid: string) {
    return this.formsService.findAll(uid, null);
  }

  @Get('/workspaceId/:workspaceId')
  findAllWithWorkspaceId(
    @Uid() uid: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.formsService.findAll(uid, workspaceId);
  }

  @Get(':id')
  findOne(@Uid() uid: string, @Param('id') id: string) {
    return this.formsService.findOne(uid, id);
  }

  @Get('shortId/:shortId')
  findOneByShortId(@Param('shortId') shortId: string) {
    return this.formsService.findOneByShortId(shortId);
  }

  @Patch(':id')
  update(
    @Uid() uid: string,
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formsService.update(uid, id, updateFormDto);
  }

  @Delete(':id')
  remove(@Uid() uid: string, @Param('id') id: string) {
    return this.formsService.remove(uid, id);
  }
}
