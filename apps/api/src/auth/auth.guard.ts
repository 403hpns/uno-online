import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { customAlphabet } from 'nanoid';
import { Socket } from 'socket.io';
import { Player } from 'src/lobby/lobby.gateway';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly logger = new Logger('🛡️  AuthGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = await client.handshake.auth.token;
    if (!token) {
      this.logger.log(`Client doesn't have a token, creating a new session`);

      await this.createSession(client);
      return true;
    }

    this.logger.log(`Client have a token: ${token}`);

    const player = await this.cacheManager.get<Player>(`player:${token}`);
    if (!player) {
      this.logger.log('Player not found, creating a new session'); // Should happen only on manually deleted from cache
      await this.createSession(client);
      return true;
    }

    client.data.player = {
      id: player.id,
      token: player.token,
      nickname: player.nickname,
    };

    client.emit('player.update', {
      nickname: player.nickname,
      id: player.id,
      token: player.token,
    });

    return true;
  }

  async createSession(client: Socket) {
    const { nickname } = client.handshake.auth;

    const sessionToken = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      16,
    )();
    const userId = randomUUID();

    await this.cacheManager.set(`player:${sessionToken}`, {
      id: userId,
      token: sessionToken,
      nickname,
    });

    client.emit('player.update', { nickname, id: userId, token: sessionToken });
    client.data.player = { id: userId, nickname, token: sessionToken };
    client.handshake.auth = { token: sessionToken, nickname };
  }
}
