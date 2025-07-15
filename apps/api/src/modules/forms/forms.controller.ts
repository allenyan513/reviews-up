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
import { FormsService } from './forms.service';
import { CreateFormDto, UpdateFormDto } from '@reviewsup/api/forms';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  create(@Jwt() jwt: JwtPayload, @Body() createFormDto: CreateFormDto) {
    return this.formsService.create(jwt.userId, createFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findAll(@Jwt() jwt: JwtPayload) {
    return this.formsService.findAll(jwt.userId, null);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/productId/:productId')
  findAllByProductId(
    @Jwt() jwt: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.formsService.findAll(jwt.userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.formsService.findOne(jwt.userId, id);
  }

  @Get('shortId/:shortId')
  findOneByShortId(@Param('shortId') shortId: string) {
    return this.formsService.findOneByShortId(shortId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formsService.update(jwt.userId, id, updateFormDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.formsService.remove(jwt.userId, id);
  }
}
