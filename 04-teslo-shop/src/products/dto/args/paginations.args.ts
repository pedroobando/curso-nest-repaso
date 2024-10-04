import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from 'src/common/dto/args';

export class PaginationSearchArgs extends PartialType(PaginationArgs) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  gender?: string;
  @IsOptional()
  @IsString()
  size: string;
}
