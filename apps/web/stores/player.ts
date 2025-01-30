import { socket } from '@/lib/socket';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Player } from '~/interfaces/player';

const LS_PLAYER_NAME_KEY = 'player:nickname';
const LS_PLAYER_TOKEN_KEY = 'player:token';

export const usePlayerStore = defineStore('player', () => {
  const token = useStorage(LS_PLAYER_TOKEN_KEY);
  const nickname = useStorage(LS_PLAYER_NAME_KEY);

  const player = ref<Partial<Player>>({
    id: '',
    token,
    nickname,
  });

  const bindEvents = () => {
    socket.on('player.token', ({ token: newToken }: { token: string }) => {
      token.value = newToken;
      socket.auth = { token: newToken };
    });

    socket.on('player.update', (payload) => {
      player.value = { ...player.value, ...payload };
    });
  };

  return { player, bindEvents };
});
