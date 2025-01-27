import { socket } from '@/lib/socket';
import { usePlayerStore } from '@/stores/player';
import { defineStore } from 'pinia';

export const useSocketStore = defineStore('socket', () => {
  const playerStore = usePlayerStore();

  const connect = () => {
    if (!socket.connected) {
      console.log(
        '%cConnecting to socket...',
        'color: green',
        playerStore.nickname,
        playerStore.user.token
      );
    }
  };

  const disconnect = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  return { connect, disconnect };
});
