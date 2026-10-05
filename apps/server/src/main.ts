import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { zodStandardSchemaConverter } from '@repo/openapi';
import { isError } from '@repo/shared';
import { writeFile } from 'fs/promises';

import { env } from '@/env';
import { AppModule } from '@/modules/app/app.module';

const logger = new Logger('Server');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [env.FRONTEND_URL],
  });

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Kickstart API')
    .setDescription('The Kickstart API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    standardSchemaConverter: zodStandardSchemaConverter,
  });
  await writeFile('.generated/schema.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
    yamlDocumentUrl: 'docs/yaml',
  });

  await app.listen(env.PORT);
  logger.log(`Server listening on port ${env.PORT}`);
}

bootstrap().catch((error: unknown) => {
  const detail = isError(error)
    ? (error.stack ?? error.message)
    : String(error);
  logger.error(`Server failed to start: ${detail}`);
  process.exit(1);
});
