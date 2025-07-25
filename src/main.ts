import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true,
      transform: true,           
      disableErrorMessages: false,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Restaurante Digital API')
    .setDescription('API para gestión de platillos, promociones y órdenes')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('🚀 Servidor corriendo en http://localhost:3000');
  console.log('📚 Documentación Swagger en http://localhost:3000/api');
}
bootstrap();