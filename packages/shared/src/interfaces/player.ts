export interface Player {
  id: string;
  nickname: string;
  token: string;

  cards: string[];
  currentLobbyId?: string;
  currentGameId?: string;
  hasDrawnCard?: boolean;
}
