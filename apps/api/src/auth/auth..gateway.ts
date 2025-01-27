import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from './auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly logger = new Logger('🎮 AuthGateway');

  async handleConnection(client: Socket) {
    const { username } = client.handshake.auth;

    this.logger.log(
      `[+] Client ${client.id} connected with username ${username}`,
    );
  }

  async handleDisconnect(client: Socket) {
    const token = client.data.player?.token;
    this.logger.log(`[-] Client ${client.id} with token ${token} disconnected`);
    return;

    if (token) {
      await this.cacheManager.del(`player:${token}`);
    }
  }
}
