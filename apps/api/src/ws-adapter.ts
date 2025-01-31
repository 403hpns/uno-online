import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: ['*'],
    };

    const optionsWithCORS = {
      ...options,
      cors,
      transports: ['websocket'],
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);

    return server;
  }
}
