import { socket } from '@/lib/socket';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

interface Player {
  id: string;
  token: string;
  username: string;
}

const LS_PLAYER_NAME_KEY = 'player:nickname';
const LS_PLAYER_TOKEN_KEY = 'player:token';

export const usePlayerStore = defineStore('player', () => {
  const nickname = ref(localStorage.getItem(LS_PLAYER_NAME_KEY) || '');
  const user = ref<Player>({
    id: '',
    token: localStorage.getItem(LS_PLAYER_TOKEN_KEY) || '',
    username: nickname.value,
  });

  const setToken = (token: string) => {
    console.log('Setting token to', token);
    user.value.token = token;
    localStorage.setItem(LS_PLAYER_TOKEN_KEY, token);
  };

  const bindEvents = () => {
    socket.on('player.token', ({ token }: { token: string }) => {
      console.log('Received player token:', token);
      setToken(token);

      socket.auth = {
        token,
      };
    });
  };

  watch(nickname, () => {
    console.log('[WATCHER] Nickname changed to', nickname.value);
    localStorage.setItem(LS_PLAYER_NAME_KEY, nickname.value);
    user.value.username = nickname.value;
  });

  return { nickname, user, bindEvents, setToken };
});
