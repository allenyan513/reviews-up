import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BrowserlessService } from './browserless.service';
import { describe, expect, it, beforeEach } from '@jest/globals';


describe('BrowserlessService', () => {
  let service: BrowserlessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      providers: [BrowserlessService],
    }).compile();

    service = module.get<BrowserlessService>(BrowserlessService);
  });
});
