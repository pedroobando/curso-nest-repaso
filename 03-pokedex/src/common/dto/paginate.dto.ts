import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  offset?: number;
}
