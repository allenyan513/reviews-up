import { Module } from '@nestjs/common';
import { CampaignsController } from '@src/modules/campaigns/campaigns.controller';
import { CampaignsService } from '@src/modules/campaigns/campaigns.service';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
