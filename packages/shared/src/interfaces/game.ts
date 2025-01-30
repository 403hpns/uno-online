import type { Player } from './player.js';

export interface GameState {
  id: string;
  players: Player[];
  currentPlayer: string;
  currentColor?: string;
  deck: string[];
  discardPile: string[];
  direction: 'clockwise' | 'counterclockwise';
  status: 'waiting' | 'in_progress' | 'finished';
}
