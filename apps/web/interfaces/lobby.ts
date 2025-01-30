import type { Player } from './player';

export type LobbyState = {
  id: string;
  ownerId?: string;
  players: Partial<Player>[];
};
