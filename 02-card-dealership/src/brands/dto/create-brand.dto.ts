import { IsString, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MinLength(3, { message: 'El minimo caracter permitido es 3' })
  name: string;
}
