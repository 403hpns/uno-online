import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './ws-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: ['http://localhost:3001'],
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
