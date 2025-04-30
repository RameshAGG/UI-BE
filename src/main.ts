import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();

  try {
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.2.223:3000'],
    credentials: true, 
  });

  await app.listen(process.env.PORT ?? 4000,);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();


