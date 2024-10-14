import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { Minios3Service } from './minios3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/files/helpers';

@Controller('minios3')
export class Minios3Controller {
  constructor(private readonly minios3Service: Minios3Service) {}

  // use inject token
  //  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  // or use inject decorator
  // constructor(@InjectMinio() private readonly minioClient: Client) {}

  @Get('buckets')
  async listbucket() {
    return { bucket: await this.minios3Service.bucketList() };
  }

  @Post('buckets/:name')
  async createBucket(@Param('name') name: string) {
    // console.log(name);
    return { bucketName: await this.minios3Service.bucketCreate(name) };
  }

  @Delete('buckets/:name')
  async removeBucket(@Param('name') name: string) {
    return { bucketName: await this.minios3Service.bucketRemove(name) };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // fileFilter: fileFilter,
      // limits: { fieldSize: 1000 },
      // storage: diskStorage({ destination: './static/products', filename: fileNamer }),
    }),
  )
  async uploadfile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that file is not a image');
    }

    return { uploadfile: await this.minios3Service.uploadfile(file, 'multer') };
  }

  @Get('file/:fileName')
  getfile(@Param('fileName') fileName: string) {
    //TODO: La cosa es por aqui pero no la implemente.
    //* https://medium.com/@connect.ashishk/creating-a-custom-httpservice-in-nestjs-with-axios-135853ee851c

    // if (!file) {
    //   throw new BadRequestException('Make sure that file is not a image');
    // }

    console.log(fileName);

    return this.minios3Service.getFile2(fileName, 'multer');
  }
}
