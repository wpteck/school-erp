import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // har URL ke aage /api
  app.enableCors();           // React ko allow karo

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();