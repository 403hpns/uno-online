import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Player } from '@repo/shared/src/interfaces/player';
import { Cache } from 'cache-manager';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  create(createPlayerDto: CreatePlayerDto) {
    return 'This action adds a new player';
  }

  findAll() {
    return `This action returns all player`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }

  async update(id: string, updatePlayerDto: Partial<UpdatePlayerDto>) {
    const existingPlayer = await this.cacheManager.get<Player>(`player:${id}`);

    const updatedPlayer = {
      ...existingPlayer,
      ...updatePlayerDto,
    };

    await this.cacheManager.set(`player:${id}`, updatedPlayer);

    return updatedPlayer;
  }

  remove(id: number) {
    return `This action removes a #${id} player`;
  }
}
