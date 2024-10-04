import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  const server = express();
  server.set('trust proxy', true); // สำหรับการใช้งาน Proxy
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));


  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Mo-Project')
  .setDescription('The Mo API description')
  .setVersion('1.0')
  .addTag('Mo')
  .build();
const document = SwaggerModule.createDocument(app, config,{
  include: [],
});
SwaggerModule.setup('docs-api', app, document);

  await app.listen(3000);
}
bootstrap();
