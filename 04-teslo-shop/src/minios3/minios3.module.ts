import { Module } from '@nestjs/common';
import { Minios3Service } from './minios3.service';
import { Minios3Controller } from './minios3.controller';
import { NestMinioModule } from 'nestjs-minio';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    NestMinioModule.register({
      endPoint: '127.0.0.1', //`'${process.env.S3_ENDPOINT}'`,
      port: 9000,
      useSSL: false,
      accessKey: process.env.S3_ACCESSKEY,
      secretKey: process.env.S3_SECRETKEY,
      isGlobal: true,
    }),
  ],
  controllers: [Minios3Controller],
  providers: [Minios3Service],
})
export class Minios3Module {}
