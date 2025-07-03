export class S3GetSignedUrlDto {
  fileName: string;
  fileType: string;
}
export class S3SignedUrlEntity {
  signedUrl: string;
  key: string;
}
