import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { LobbyModule } from './lobby/lobby.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    PlayerModule,
    GameModule,
    LobbyModule,

    ...(process.env.USE_REDIS === 'true'
      ? [
          CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => {
              console.log('Redis...');
              return {
                stores: [new KeyvRedis('redis://localhost:6379')],
              };
            },
          }),
        ]
      : [
          CacheModule.register({
            isGlobal: true,
          }),
        ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
