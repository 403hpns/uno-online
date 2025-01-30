import { socket } from '@/lib/socket';
import type { GameState } from '@repo/shared/interfaces/game';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState | null>(null);
  const currentColor = ref();
  const router = useRouter();

  const bindEvents = () => {
    socket.on('game.update', (state: GameState) => {
      gameState.value = state;
      currentColor.value = state.currentColor;
    });

    socket.on('game.pickCardColor', (ack) => {
      const color = prompt('Pick a color');

      ack({ color });
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
