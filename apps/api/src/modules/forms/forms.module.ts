import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { FormsPublicController } from './forms-public.controller';

@Module({
  controllers: [FormsController, FormsPublicController],
  providers: [FormsService],
})
export class FormsModule {}
