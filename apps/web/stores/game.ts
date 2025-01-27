import { socket } from '@/lib/socket';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Player {
  id: string;
  username: string;
  token: string;
  cards: string[];
}

interface GameState {
  id: string;
  players: Player[];
  currentPlayer: string;
  deck: string[];
  discardPile: string[];
  direction: 'clockwise' | 'counterclockwise';
  status: 'waiting' | 'in_progress' | 'finished';
}

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState | null>(null);
  const currentColor = ref<'red' | 'blue' | 'green' | 'yellow' | 'wild'>();
  const router = useRouter();

  const bindEvents = () => {
    socket.on('game.update', (state: GameState) => {
      gameState.value = state;
      currentColor.value =
        state.discardPile.length > 0
          ? (state.discardPile[state.discardPile.length - 1]
              .split('_')[0]
              .toLowerCase() as 'red' | 'blue' | 'green' | 'yellow')
          : 'red';
    });

    socket.on('game.created', (gameState) => {
      router.push({ path: `/game/${gameState.id}`, replace: true });
    });

    socket.on('game.finished', (winner: string) => {
      alert(`Game over! Winner: ${winner}`);
      router.push({ path: '/', replace: true });
    });

    socket.on('error', (error: { message: string }) => {
      alert(error.message);
    });
  };

  const joinGame = (gameId: string) => {
    socket.emit('game.join', gameId);
  };

  const playCard = (gameId: string, card: string) => {
    socket.emit('game.playCard', { gameId, card });
  };

  const drawCard = (gameId: string) => {
    socket.emit('game.drawCard', gameId);
  };

  return {
    gameState,
    currentColor,
    bindEvents,
    joinGame,
    playCard,
    drawCard,
  };
});
