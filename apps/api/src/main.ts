import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dbConnection } from './db';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupApp } from './app/setup';

async function bootstrap() {
  await dbConnection();

  const app = await NestFactory.create(AppModule);

  setupApp(app);

  const config = new DocumentBuilder()
    .setTitle('Personal Finance Tracker API')
    .setDescription('Portfolios and transactions API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(9000);
}
bootstrap();
