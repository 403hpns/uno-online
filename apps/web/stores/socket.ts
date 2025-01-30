import { socket } from '@/lib/socket';
import { usePlayerStore } from '@/stores/player';
import { defineStore } from 'pinia';

export const useSocketStore = defineStore('socket', () => {
  const playerStore = usePlayerStore();

  const connect = () => {
    if (!socket.connected) {
      socket.auth = {
        nickname: playerStore.player.nickname,
        token: playerStore.player.token,
      };

      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  return { connect, disconnect };
});
