import { Test, TestingModule} from '@nestjs/testing';
import { EmailService } from './email.service';
import { EMAIL_FROM, EMAIL_SUBJECTS } from './email.constants';
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

  it('should be defined', async () => {
    const html = await service.render('application-create', {
      websiteName: 'test',
      websiteUrl: 'https://www.toolify.ai/tool/reimagine-home',
    });
    await service.send({
      from: EMAIL_FROM,
      to: ['wsyanligang@gmail.com'],
      subject: EMAIL_SUBJECTS.create,
      html: html,
    });
    expect(service).toBeDefined();
  }, 10000);
});
