import { socket } from '@/lib/socket';
import type { Player } from '@repo/shared/interfaces/player';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const LS_PLAYER_NAME_KEY = 'player:nickname';
const LS_PLAYER_TOKEN_KEY = 'player:token';

export const usePlayerStore = defineStore('player', () => {
  const token = useStorage(LS_PLAYER_TOKEN_KEY, '');
  const nickname = useStorage(LS_PLAYER_NAME_KEY, '');

  const player = ref<Player>({
    id: '',
    token: token.value,
    nickname: nickname.value,
    cards: [],
  });

  watch(
    () => player.value.nickname,
    () => (nickname.value = player.value.nickname)
  );

  watch(
    () => player.value.token,
    () => (token.value = player.value.token)
  );

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
