import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 })
  @IsInt({ message: 'El no: debe ser un entero' })
  @IsPositive({ message: 'El no: debe contener valores positivos' })
  @Min(1, { message: 'El no: el valor minimo es uno (1)' })
  no: number;

  @IsString()
  @MinLength(2, {
    message: 'El name: debe contener minimo dos (2) o mas caracteres',
  })
  name: string;
}
