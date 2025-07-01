import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // ConfigModule.forRoot({
        //   isGlobal: true,
        //   envFilePath: `.env.${process.env.NODE_ENV}`,
        // }),
      ],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', async () => {}, 10000);
});
