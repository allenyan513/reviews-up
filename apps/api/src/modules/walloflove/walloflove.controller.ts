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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { WallOfLoveService } from './walloflove.service';
import { UpdateWallOfLoveDto } from '@reviewsup/api/walloflove';

@Controller('walloflove')
export class WallOfLoveController {
  constructor(private readonly wallOfLoveService: WallOfLoveService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/productId/:productId')
  findAllByProductId(
    @Jwt() jwt: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.wallOfLoveService.findOneByProductId(jwt.userId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWallOfLoveDto,
  ) {
    return this.wallOfLoveService.update(jwt.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.wallOfLoveService.remove(jwt.userId, id);
  }
}
