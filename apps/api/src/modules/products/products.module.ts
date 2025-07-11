import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ShowcasesService } from '@src/modules/showcases/showcases.service';
import { ShowcasesModule } from '../showcases/showcases.module';

@Module({
  imports: [ShowcasesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ShowcasesService],
})
export class ProductsModule {}
