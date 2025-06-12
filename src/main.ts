import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allows all origins
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
