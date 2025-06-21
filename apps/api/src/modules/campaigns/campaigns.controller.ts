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
import { JwtPayload } from '@src/common/types/jwt-payload';
import { CampaignsService } from '@src/modules/campaigns/campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from '@repo/api/campaign/index';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  create(@Jwt() jwt: JwtPayload, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(jwt.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findAll(@Jwt() jwt: JwtPayload) {
    return this.campaignsService.findAll(jwt.userId, null);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/workspaceId/:workspaceId')
  findAllWithWorkspaceId(
    @Jwt() jwt: JwtPayload,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.campaignsService.findAll(jwt.userId, workspaceId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.campaignsService.findOne(jwt.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Jwt() jwt: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(jwt.userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Jwt() jwt: JwtPayload, @Param('id') id: string) {
    return this.campaignsService.remove(jwt.userId, id);
  }
}
