import { socket } from '@/lib/socket';
import type { GameState } from '@repo/shared/interfaces/game';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState>();
  const currentColor = ref();
  const router = useRouter();
  const isColorPickerVisible = ref(false);
  let ackCallback: ((response: { color: string }) => void) | null = null;

  const bindEvents = () => {
    socket.on('game.update', (state: GameState) => {
      gameState.value = { ...state };
      currentColor.value = state.currentColor;
    });

    socket.on('game.pickCardColor', (ack) => {
      isColorPickerVisible.value = true;
      ackCallback = ack;
    });

    socket.on('game.created', (gameState) => {
      gameState.value = { ...gameState };
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

  const playCard = (card: string) => {
    socket.emit('game.playCard', { gameId: gameState.value?.id, card });
  };

  const drawCard = () => {
    socket.emit('game.drawCard', gameState.value?.id);
  };

  const pickColor = (color: 'Red' | 'Green' | 'Blue' | 'Yellow') => {
    if (ackCallback) {
      ackCallback({ color });
      isColorPickerVisible.value = false;
      ackCallback = null;
    }
  };

  return {
    gameState,
    currentColor,
    bindEvents,
    joinGame,
    playCard,
    drawCard,
    pickColor,
    isColorPickerVisible,
  };
});
