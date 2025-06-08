// import { Test, TestingModule } from '@nestjs/testing';
// import { S3Service } from './s3.service';
// import { ConfigModule } from '@nestjs/config';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as mime from 'mime-types';
//
// describe('S3Service', () => {
//   let service: S3Service;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         ConfigModule.forRoot({
//           isGlobal: true,
//           envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
//         }),
//       ],
//       providers: [S3Service],
//     }).compile();
//
//     service = module.get<S3Service>(S3Service);
//   });
//
//   it('x', async () => {
//     const r = await service.put('1', '1');
//     console.log(r);
//   });
//
//   it('upload file', async () => {
//     const filePath = path.join(__dirname, 'test.txt'); // Adjust the path to your test file
//     const fileStream = fs.readFileSync(filePath);
//     const contentType = mime.lookup(filePath) || 'application/octet-stream';
//     const result = await service.uploadFile(
//       'test.txt',
//       fileStream,
//       contentType,
//     );
//     expect(result).toHaveProperty('Location');
//   });
// });
