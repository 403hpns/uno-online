import { Module } from '@nestjs/common';
import { PlayerModule } from 'src/player/player.module';
import { LobbyGateway } from './lobby.gateway';

@Module({
  imports: [PlayerModule],
  providers: [LobbyGateway],
  exports: [LobbyGateway],
})
export class LobbyModule {}
