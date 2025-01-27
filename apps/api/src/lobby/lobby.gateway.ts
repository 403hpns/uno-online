import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { customAlphabet } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';

type Player = {
  id: string;
  username: string;
  token: string;
};

interface LobbyState {
  id: string;
  players: Player[];
}

const LOBBY_MAX_PLAYERS = 2;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
export class LobbyGateway {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @WebSocketServer()
  server: Server;

  async findOne(id: string) {
    return await this.cacheManager.get(`lobby:${id}`);
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

    const { username, token } = owner.data.player;
    const players = [{ id: client.id, username, token }];

    await this.cacheManager.set(`lobby:${lobbyId}`, {
      id: lobbyId,
      players,
    });

    client.join(lobbyId);

    return {
      id: lobbyId,
      players,
    };
  }

  @SubscribeMessage('lobby.join')
  async joinLobby(
    @MessageBody() { lobbyId }: { lobbyId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const lobby = (await this.cacheManager.get(
      `lobby:${lobbyId}`,
    )) as LobbyState;
    if (!lobby) {
      throw new WsException('Lobby does not exist');
    }

    const isLobbyReachedMaxPlayers = lobby.players.length >= LOBBY_MAX_PLAYERS;
    if (isLobbyReachedMaxPlayers) {
      throw new WsException('Reached max players in this lobby');
    }

    const { username, token } = client.data.player;

    const isClientAlreadyInLobby = lobby.players.find(
      (client) => client.token === token,
    );
    if (isClientAlreadyInLobby) {
      throw new WsException('You are already in this lobby');
    }

    const updatedPlayers = [
      ...lobby.players,
      { id: client.id, username, token },
    ];

    await this.cacheManager.set(`lobby:${lobbyId}`, {
      ...lobby,
      players: updatedPlayers,
    });

    client.join(lobbyId);

    this.server
      .to(lobbyId)
      .emit('lobby.update', { id: lobbyId, players: updatedPlayers });

    return { id: lobbyId, players: updatedPlayers };
  }
}
