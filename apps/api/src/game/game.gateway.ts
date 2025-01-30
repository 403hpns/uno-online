import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { type GameState } from '@repo/shared/src/interfaces/game';
import { type Player } from '@repo/shared/src/interfaces/player';
import type { Cache } from 'cache-manager';
import { customAlphabet } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { LobbyGateway } from 'src/lobby/lobby.gateway';
import { CreateGameDto } from './dto/create-game.dto';
import { GameService } from './game.service';

const GAME_STATE_CACHE_KEY = 'game';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(AuthGuard)
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly lobbyGateway: LobbyGateway,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @SubscribeMessage('game.create')
  async create(client: Socket, payload: CreateGameDto) {
    const { lobbyId, players } = payload;

    const gameExist = await this.lobbyGateway.findOne(lobbyId);

    const gameId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10)();
    const playerList = [];
    const currentPlayer = players[0].id;
    const deck = this.generateDeck();
    const discardPile = [];
    const direction = 'clockwise';
    const status = 'in_progress';

    const gameState: GameState = {
      id: gameId,
      players: players.map((player) => ({
        ...player,
        cards: [],
      })),
      currentPlayer,
      deck,
      discardPile,
      direction,
      status,
    };

    gameState.players.forEach((player) => {
      player.cards = this.drawCards(gameState.deck, 7);
    });

    const firstCard = this.drawCard(gameState.deck);
    if (firstCard) {
      gameState.discardPile.push(firstCard);
      gameState.currentColor = firstCard.split('_')[0];
    } else {
      throw new Error('Cannot draw a card from an empty deck');
    }

    await this.cacheManager.set(`${GAME_STATE_CACHE_KEY}:${gameId}`, gameState);

    client.join(gameId);
    this.server.to(lobbyId).emit('game.created', gameState);
    this.server.in(lobbyId).socketsJoin(gameId);

    Logger.log(`Game ${gameId} created`);
  }

  @SubscribeMessage('game.join')
  async handleJoinGame(client: Socket, gameId: string) {
    const gameState = await this.cacheManager.get<GameState>(
      `${GAME_STATE_CACHE_KEY}:${gameId}`,
    );

    if (!gameState) {
      client.emit('error', { message: 'Game not found' });
      return;
    }

    client.join(gameId);
    client.emit('game.update', gameState);

    Logger.log(`Player ${client.data.player.nickname} joined game ${gameId}`);
  }

  @SubscribeMessage('game.playCard')
  async handlePlayCard(
    client: Socket,
    payload: { gameId: string; card: string },
  ) {
    const { gameId, card } = payload;

    const gameState = await this.cacheManager.get<GameState>(
      `${GAME_STATE_CACHE_KEY}:${gameId}`,
    );

    if (!gameState) {
      client.emit('error', { message: 'Game not found' });
      return;
    }

    const validRoundTurn = gameState.currentPlayer === client.data.player.id;
    if (!validRoundTurn) {
      throw new WsException("It's not your turn");
    }

    if (this.isValidMove(gameState, card)) {
      const player = gameState.players.find(
        (p) => p.id === client.data.player.id,
      );
      if (player) {
        player.cards = player.cards.filter((c) => c !== card);
        gameState.discardPile.push(card);
        gameState.currentColor = card.split('_')[0];

        // raczej po sprawdzeniu czy karta jest specjalna
        gameState.currentPlayer = this.getNextPlayer(gameState);

        await this.cacheManager.set(
          `${GAME_STATE_CACHE_KEY}:${gameId}`,
          gameState,
        );

        this.server.to(gameId).emit('game.update', gameState);

        // TODO: Handle special cards
        const [color, value] = card.split('_');
        if (value === 'Skip') {
          gameState.currentPlayer = this.getNextPlayer(gameState);
        } else if (value === 'Reverse') {
          gameState.direction =
            gameState.direction === 'clockwise'
              ? 'counterclockwise'
              : 'clockwise';
        } else if (value === 'Draw') {
          const nextPlayer = gameState.players.find(
            (p) => p.id === gameState.currentPlayer,
          );
          if (nextPlayer) {
            nextPlayer.cards = [
              ...nextPlayer.cards,
              ...this.drawCards(gameState.deck, 2),
            ];
          }
          gameState.currentPlayer = this.getNextPlayer(gameState);
        } else if (value === 'Draw4') {
          const response = await client.emitWithAck('game.pickCardColor');

          gameState.currentColor = response.color;

          const nextPlayer = gameState.players.find(
            (p) => p.id === gameState.currentPlayer,
          );
          if (nextPlayer) {
            nextPlayer.cards = [
              ...nextPlayer.cards,
              ...this.drawCards(gameState.deck, 4),
            ];
          }
          gameState.currentPlayer = this.getNextPlayer(gameState);
        } else if (color === 'Wild') {
          const response = await client.emitWithAck('game.pickCardColor');
          gameState.currentColor = response.color;
          gameState.currentPlayer = this.getNextPlayer(gameState);
        }

        await this.cacheManager.set(
          `${GAME_STATE_CACHE_KEY}:${gameId}`,
          gameState,
        );

        this.server.to(gameId).emit('game.update', gameState);

        if (player.cards.length === 0) {
          this.server
            .to(gameId)
            .emit('game.finished', { winner: player.nickname });
          gameState.status = 'finished';
          await this.cacheManager.set(
            `${GAME_STATE_CACHE_KEY}:${gameId}`,
            gameState,
          );
        }
      }
    } else {
      client.emit('error', { message: 'Invalid move' });
    }
  }

  @SubscribeMessage('game.drawCard')
  async handleDrawCard(client: Socket, gameId: string) {
    const gameState = await this.cacheManager.get<GameState>(
      `${GAME_STATE_CACHE_KEY}:${gameId}`,
    );

    if (!gameState) {
      client.emit('error', { message: 'Game not found' });
      return;
    }

    if (gameState.currentPlayer !== client.data.player.id) {
      throw new WsException("It's not your turn");
    }

    const player = gameState.players.find(
      (p) => p.id === client.data.player.id,
    );

    if (player) {
      if (player.hasDrawnCard) {
        client.emit('error', {
          message: 'You can only draw one card per turn',
        });
        return;
      }

      const isDeckEmpty = !gameState.deck.length;
      if (isDeckEmpty) {
        gameState.deck = gameState.discardPile.slice(0, -1); // nie do konca bo chce sie pozbyc rowniez tych z discardPile
      }

      const card = this.drawCard(gameState.deck);
      if (card) {
        player.cards.push(card);

        player.hasDrawnCard = true;

        const canPlayAnyCard = player.cards.some((c) =>
          this.isValidMove(gameState, c),
        );

        if (!canPlayAnyCard) {
          gameState.currentPlayer = this.getNextPlayer(gameState);
        }

        await this.cacheManager.set(
          `${GAME_STATE_CACHE_KEY}:${gameId}`,
          gameState,
        );

        this.server.to(gameId).emit('game.update', gameState);
      } else {
        gameState.deck = gameState.discardPile.splice(0, -1);
        await this.cacheManager.set(
          `${GAME_STATE_CACHE_KEY}:${gameId}`,
          gameState,
        );
      }
    }
  }

  private generateDeck(): string[] {
    const colors = ['Red', 'Green', 'Blue', 'Yellow'];
    const values = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Skip',
      'Reverse',
      'Draw',
    ];

    const deck: string[] = [];

    colors.forEach((color) => {
      values.forEach((value) => {
        if (value === '0') {
          deck.push(`${color}_${value}`);
        } else {
          deck.push(`${color}_${value}`);
          deck.push(`${color}_${value}`);
        }
      });
    });

    deck.push('Wild', 'Wild', 'Wild', 'Wild');
    deck.push('Wild_Draw4', 'Wild_Draw4', 'Wild_Draw4', 'Wild_Draw4');

    return this.shuffleDeck(deck);
  }

  private shuffleDeck(deck: string[]): string[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  private drawCards(deck: string[], count: number): string[] {
    const cards: string[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.drawCard(deck);
      if (card) {
        cards.push(card);
      }
    }
    return cards;
  }

  private drawCard(deck: string[]): string | undefined {
    return deck.pop();
  }

  private isValidMove(gameState: GameState, card: string): boolean {
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    const [topColor, topValue] = [topCard[0], topCard.split('_')[1]];
    const [cardColor, cardValue] = [card[0], card.split('_')[1]];

    if (
      (topValue === 'Draw4' || topColor === 'W') &&
      cardColor === gameState.currentColor![0]
    ) {
      return true;
    }

    return (
      cardColor === topColor || cardValue === topValue || cardColor === 'W'
    );
  }

  private getNextPlayer(gameState: GameState): string {
    const currentPlayerIndex = gameState.players.findIndex(
      (p: Player) => p.id === gameState.currentPlayer,
    );

    const nextPlayerIndex =
      gameState.direction === 'clockwise'
        ? (currentPlayerIndex + 1) % gameState.players.length
        : (currentPlayerIndex - 1 + gameState.players.length) %
          gameState.players.length;

    gameState.players[currentPlayerIndex].hasDrawnCard = false;

    return gameState.players[nextPlayerIndex].id;
  }

  private isSpecialCard(card: string) {}
}
