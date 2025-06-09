import { Module } from '@nestjs/common';
import { ShowcasesService } from './showcases.service';
import { ShowcasesController } from './showcases.controller';

@Module({
  controllers: [ShowcasesController],
  providers: [ShowcasesService],
})
export class ShowcasesModule {}
