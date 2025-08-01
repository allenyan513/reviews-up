import { Global, Module } from '@nestjs/common';
import { WallOfLoveController } from './walloflove.controller';
import { WallOfLoveService } from '@src/modules/walloflove/walloflove.service';

@Global()
@Module({
  controllers: [WallOfLoveController],
  providers: [WallOfLoveService],
  exports: [WallOfLoveService],
})
export class WallOfLoveModule {}
