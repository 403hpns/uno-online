import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './ws-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: true,
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
