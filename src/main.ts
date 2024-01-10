import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from './utils/zod/zod-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  await app.listen(3333);
}
bootstrap();
