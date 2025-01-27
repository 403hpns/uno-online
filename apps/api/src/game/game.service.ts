import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

const GAME_CACHE_KEY = 'game';

@Injectable()
export class GameService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async create(createGameDto: CreateGameDto) {
    const gameId = nanoid();
    const gameExistInCache = await this.cache.get(
      `${GAME_CACHE_KEY}:${gameId}`,
    );
    if (gameExistInCache) {
      throw new ConflictException('Game with given ID already exist');
    }

    const game = await this.cache.set(gameId, createGameDto);

    return game;
  }

  findAll() {
    return this.cache.get(`${GAME_CACHE_KEY}:*`);
  }

  findOne(id: string) {
    const game = this.cache.get(`${GAME_CACHE_KEY}:${id}`);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }

  update(id: string, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: string) {
    return `This action removes a #${id} game`;
  }
}
