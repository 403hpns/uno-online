import { Module } from '@nestjs/common';
import { LobbyModule } from 'src/lobby/lobby.module';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [LobbyModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
