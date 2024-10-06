import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  private readonly securePath: string;

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {
    this.securePath = configService.get<string>('hostapi');
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fieldSize: 1000 },
      storage: diskStorage({ destination: './static/products', filename: fileNamer }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that file is not a image');
    }

    const secureUrl = `${this.securePath}/files/product/${file.filename}`;

    return { secureUrl };
  }

  @Get('product/:imageName')
  findProductImagen(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);
    return res.status(200).sendFile(path);
  }
}
