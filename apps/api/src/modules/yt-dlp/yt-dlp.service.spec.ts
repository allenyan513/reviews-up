import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { YtDlpService } from './yt-dlp.service';

describe('YtDlpService', () => {
  let service: YtDlpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [YtDlpService],
    }).compile();

    service = module.get<YtDlpService>(YtDlpService);
  });

  it('should be defined', async () => {
    // const url = 'https://www.youtube.com/watch?v=EQrtrjdFK4k&t=437s';
    const url =
      'https://www.tiktok.com/@cherdleys5/video/7486296599136652586?is_from_webapp=1&sender_device=pc';
    const result = await service.parse({ url });
    console.log(result);
  }, 10000);
});
