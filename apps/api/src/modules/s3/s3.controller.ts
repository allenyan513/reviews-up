import { Controller, Post, Body } from '@nestjs/common';
import { S3GetSignedUrlDto } from '@repo/api/s3/dto/s3-get-signed-url.dto';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('getSignedUrl')
  async getSignedUrl(@Body() dto: S3GetSignedUrlDto) {
    return this.s3Service.getSignedUrl(dto.fileName, dto.fileType);
  }
}
