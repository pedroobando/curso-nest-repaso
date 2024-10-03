import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  // @IsIn(['XS', 'S', 'M', 'L', 'XL'])
  sizes: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}
