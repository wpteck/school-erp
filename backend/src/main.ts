import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // DTO se bahar wale fields hata do
      forbidNonWhitelisted: true, // extra field aaye to error do
      transform: true,            // data ko DTO class/type mein badlo
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();