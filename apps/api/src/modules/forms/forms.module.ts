import { Global, Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';

@Global()
@Module({
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
