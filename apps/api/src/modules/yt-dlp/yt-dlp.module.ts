import { Global, Module } from '@nestjs/common';
import { YtDlpService } from '@src/modules/yt-dlp/yt-dlp.service';

@Global()
@Module({
  providers: [YtDlpService],
  exports: [YtDlpService],
})
export class YtDlpModule {}
