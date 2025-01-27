import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { customAlphabet } from 'nanoid';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;

    if (!token) {
      await this.createSession(client);
      return true;
    }

    const player = (await this.cacheManager.get(`player:${token}`)) as any;
    if (!player) {
      await this.createSession(client);
      return true;
    }

    client.data.player = {
      id: player.socketId,
      token,
      username: player.username,
    };

    return true;
  }

  async createSession(client: Socket) {
    const { username } = client.handshake.auth;

    const sessionToken = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      16,
    )();

    await this.cacheManager.set(`player:${sessionToken}`, {
      socketId: client.id,
      token: sessionToken,
      username,
    });

    client.emit('player.token', { token: sessionToken });
    client.data.player = { id: client.id, token: sessionToken, username };
  }
}
