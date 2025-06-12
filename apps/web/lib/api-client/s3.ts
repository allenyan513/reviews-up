import { S3SignedUrlEntity } from '@repo/api/s3/entity/s3-signed-url.entity';
import { S3GetSignedUrlDto } from '@repo/api/s3/dto/s3-get-signed-url.dto';
import { authFetch } from './auth-fetch';

export const s3 = {
  getSignedUrl: (dto: S3GetSignedUrlDto): Promise<S3SignedUrlEntity> =>
    authFetch('/s3/getSignedUrl', 'POST', dto),
};
