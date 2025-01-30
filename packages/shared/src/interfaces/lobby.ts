import type { Player } from './player.js';

export type LobbyState = {
  id: string;
  ownerId?: string;
  players: Partial<Player>[];
};
