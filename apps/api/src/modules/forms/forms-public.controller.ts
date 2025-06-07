import { Controller, Get, Param } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms/public')
export class FormsPublicController {
  constructor(private readonly formsService: FormsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOnePublic(id);
  }
}
