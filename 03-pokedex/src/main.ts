import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //* NOTE: esto transforma las variables de los DTO a numero o al objeto que se establesca
      //* NOTE: no lo utilizo ya que consume recurso en memoria, es preferible utilizar
      //* NOTE: @Type(() => Number) de class-transformer
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
