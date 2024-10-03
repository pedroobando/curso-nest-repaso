import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //* Swagger Module
  // const config = new DocumentBuilder()
  //   .setTitle('Teslo RestFull Api')
  //   .setDescription('Teslo Shop End Point')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/doc', app, document);

  const portRunning = process.env.PORT;
  await app.listen(portRunning);
  logger.log(`App running on port ${portRunning}`);
}
bootstrap();
