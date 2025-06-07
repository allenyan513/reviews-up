import { Injectable } from '@nestjs/common';
import { CreateWidgetDto } from '@repo/api/widgets/dto/create-widget.dto';
import { UpdateWidgetDto } from '@repo/api/widgets/dto/update-widget.dto';

@Injectable()
export class WidgetsService {
  create(createWidgetDto: CreateWidgetDto) {
    return 'This action adds a new widget';
  }

  findAll() {
    return `This action returns all widgets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} widget`;
  }

  update(id: number, updateWidgetDto: UpdateWidgetDto) {
    return `This action updates a #${id} widget`;
  }

  remove(id: number) {
    return `This action removes a #${id} widget`;
  }
}
