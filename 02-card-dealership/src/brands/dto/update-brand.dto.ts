// import { PartialType } from '@nestjs/mapped-types';
// import { CreateBrandDto } from './create-brand.dto';

// export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

import { IsString, MinLength } from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @MinLength(3, { message: 'El minimo caracter permitido es 3' })
  name: string;
}
