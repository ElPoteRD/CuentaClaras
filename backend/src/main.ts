import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from 'config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); 
  app.enableCors(); 

  //Swagger config
  const config = new DocumentBuilder()
    .setTitle('Cuentas Claras API')
    .setDescription('The Cuentas Claras API. Here you find all endpoints of API.')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  //Run server
  await app.listen(PORT ?? 3001);
}
bootstrap();
