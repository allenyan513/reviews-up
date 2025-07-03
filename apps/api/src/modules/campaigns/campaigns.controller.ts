import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { Jwt } from '@src/modules/auth/decorators/jwt.decorator';
import { JwtPayload } from '@src/app.types';
import { CampaignsService } from '@src/modules/campaigns/campaigns.service';
import {
  CreateCampaignDto,
  FindAllCampaignsRequest,
  findAllCampaignsRequestSchema,
  UpdateCampaignDto,
} from '@repo/api/campaign';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  create(@Jwt() jwt: JwtPayload, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(jwt.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/workspaceId/:workspaceId')
  findAllWithWorkspaceId(
    @Jwt() jwt: JwtPayload,
    @Param('workspaceId') workspaceId: string,
    @Query() query: any,
  ) {
    const req = findAllCampaignsRequestSchema.parse({
      userId: jwt.userId,
      workspaceId,
      ...query,
    }) as FindAllCampaignsRequest;
    return this.campaignsService.findAll(req);
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
