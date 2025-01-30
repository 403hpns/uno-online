import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { type LobbyState } from '@repo/shared/src/interfaces/lobby';
import { type Player } from '@repo/shared/src/interfaces/player';
import { Cache } from 'cache-manager';
import { customAlphabet } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { PlayerService } from 'src/player/player.service';
const LOBBY_MAX_PLAYERS = 2;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
export class LobbyGateway implements OnGatewayDisconnect {
  constructor(
    private readonly playerService: PlayerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('🎮 LobbyGateway');

  async findOne(id: string) {
    return await this.cacheManager.get(`lobby:${id}`);
  }

  async handleDisconnect(client: Socket) {
    if (!client.data?.player) {
      this.logger.error(`No player data found on disconnect.`);
      return;
    }

    const { token } = client.data?.player;

    if (!token) {
      this.logger.error(`No token found on disconnect : ${token}`);
      return;
    }

    const player = await this.cacheManager.get<Player>(`player:${token}`);
    if (!player) {
      this.logger.error(`Player does not exist on disconnect`);
      return;
    }

    const lobby = await this.cacheManager.get<LobbyState>(
      `lobby:${player.currentLobbyId}`,
    );
    if (!lobby) {
      this.logger.error(`Lobby does not exist`);
      return;
    }

    const updatedPlayers = lobby.players.filter(
      (lobbyPlayer) => lobbyPlayer.id !== player.id,
    );

    let ownerId = lobby.ownerId;
    if (lobby.ownerId === player.id) {
      ownerId = lobby.players[0].id;
    }

    await this.cacheManager.set(`lobby:${lobby.id}`, {
      ...lobby,
      ownerId,
      players: updatedPlayers,
    });

    this.server
      .to(lobby.id)
      .emit('lobby.update', { id: lobby.id, players: updatedPlayers });

    if (updatedPlayers.length === 0) {
      await this.cacheManager.del(`lobby:${lobby.id}`);
    }
  }

  @SubscribeMessage('lobby.create')
  async createLobby(@ConnectedSocket() client: Socket) {
    const lobbyId = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      8,
    )();

    const isAlreadyExist = await this.cacheManager.get<LobbyState>(
      `lobby:${lobbyId}`,
    );
    if (isAlreadyExist) {
      throw new WsException('Lobby with given ID already exist'); // This should never happen
    }

    const owner = this.server.sockets.sockets.get(client.id);
    if (!owner) {
      throw new WsException('Lobby owner not found'); // This should never happen
    }

    const { nickname, token, id } = owner.data.player;
    const players = [{ id, nickname }];

    await this.cacheManager.set(
      `lobby:${lobbyId}`,
      {
        id: lobbyId,
        players,
        ownerId: id,
      },
      6000 * 60 * 24, // 24 hours
    );
    //

    this.playerService.update(token, { currentLobbyId: lobbyId });

    client.join(lobbyId);

    return {
      id: lobbyId,
      ownerId: id,
      players,
    };
  }

  @SubscribeMessage('lobby.join')
  async joinLobby(
    @MessageBody() { lobbyId }: { lobbyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const lobby = await this.cacheManager.get<LobbyState>(`lobby:${lobbyId}`);
    if (!lobby) {
      throw new WsException('Lobby does not exist');
    }

    const isLobbyReachedMaxPlayers = lobby.players.length >= LOBBY_MAX_PLAYERS;
    if (isLobbyReachedMaxPlayers) {
      throw new WsException('Reached max players in this lobby');
    }

    const { nickname, token, id } = client.data.player;

    const isClientAlreadyInLobby = lobby.players.find(
      (client) => client.id === id,
    );
    if (isClientAlreadyInLobby) {
      throw new WsException('You are already in this lobby');
    }

    const updatedPlayers = [...lobby.players, { id, nickname }];

    await this.cacheManager.set(`lobby:${lobbyId}`, {
      ...lobby,
      players: updatedPlayers,
    });

    client.join(lobbyId);

    this.playerService.update(token, { currentLobbyId: lobbyId });

    this.server.to(lobbyId).emit('lobby.update', {
      id: lobbyId,
      ownerId: lobby.ownerId,
      players: updatedPlayers,
    });

    return { id: lobbyId, ownerId: lobby.ownerId, players: updatedPlayers };
  }
}
