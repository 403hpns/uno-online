import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { LobbyModule } from './lobby/lobby.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    AuthModule,
    PlayerModule,
    GameModule,
    LobbyModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [new KeyvRedis('redis://localhost:6379')],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
