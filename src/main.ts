import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseWrapperInterceptor } from './libs/interceptor/response-wrapper.interceptor';
import { HttpExceptionFilter } from './libs/exception/global-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Mumz Weather APP')
    .setDescription('The Weather API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 9100);
}
bootstrap();
