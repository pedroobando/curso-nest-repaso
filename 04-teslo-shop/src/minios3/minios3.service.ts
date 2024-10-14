import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';

@Injectable()
export class Minios3Service {
  // constructor(@Inject(MINIO_CONNECTION) private readonly minioClient) {}
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: Client,
    private readonly httpService: HttpService,
  ) {}

  async bucketList() {
    try {
      const buckets = await this.minioClient.listBuckets();
      return buckets;
    } catch (error) {
      console.log(error);
    }
  }

  async bucketCreate(name: string) {
    const exitBucket = await this.minioClient.bucketExists(name);
    if (exitBucket) throw new BadRequestException(`El bucket ${name}, ya esta creado.`);

    try {
      const bucket = await this.minioClient.makeBucket(name);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async bucketRemove(name: string) {
    const exitBucket = await this.minioClient.bucketExists(name);
    if (!exitBucket) throw new NotFoundException(`El bucket ${name}, no fue encontrado.`);

    try {
      await this.minioClient.removeBucket(name);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadfile(file: Express.Multer.File, bucketName: string) {
    const exitBucket = await this.minioClient.bucketExists(bucketName);
    if (!exitBucket) await this.bucketCreate(bucketName);

    try {
      let objInfo_: any;
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const succesUpload = await this.minioClient.putObject(
        bucketName,
        fileName,
        // file.originalname,
        file.buffer,
        file.size,
        function (err: Error, objInfo: any) {
          if (err) {
            return console.log(err); // err should be null
          }
          console.log('Success', objInfo);
          objInfo_ = objInfo;
        },
      );

      return { fileMinio: { oldName: file.originalname, newName: fileName, bucketName }, objInfo_, succesUpload };
    } catch (error) {
      console.log(error);
    }
  }

  async getfile(fileName: string, bucketName: string) {
    const exitBucket = await this.minioClient.bucketExists(bucketName);
    if (!exitBucket) throw new NotFoundException(`Bucket ${bucketName} not found`);

    try {
      let size = 0;
      const dataStream = await this.minioClient.getObject(bucketName, fileName);
      dataStream.on('data', function (chunk) {
        size += chunk.length;
      });
      dataStream.on('end', function () {
        console.log('End. Total size = ' + size);
      });
      dataStream.on('error', function (err) {
        console.log(err);
      });
      console.log(dataStream);
      return { okey: true };
    } catch (error) {
      console.log(error);
    }
  }

  async getFile2(fileName: string, bucketName: string) {
    return await this.httpService.axiosRef.get(`localhost:9000/${bucketName}/${fileName}`);
  }
}
