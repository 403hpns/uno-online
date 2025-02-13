import { socket } from '@/lib/socket';
import type { LobbyState } from '@repo/shared/interfaces/lobby';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePlayerStore } from './player';
const CREATE_LOBBY_EVENT = 'lobby.create';
const JOIN_LOBBY_EVENT = 'lobby.join';

export type WsException = { status: string; message: string };

let countdownInterval;

export const useLobbyStore = defineStore('lobby', () => {
  const playerStore = usePlayerStore();

  const lobbyState = ref<LobbyState | null>(null);
  const countdownStarted = ref(false);
  const counter = ref(5);

  const router = useRouter();
  const route = useRoute();

  const isLoading = ref(false);

  const bindEvents = () => {
    socket.on('disconnect', () => {
      lobbyState.value = null;
    });

    socket.on('lobby.update', (data) => {
      lobbyState.value = { ...data };
    });

    socket.on('game.start', async () => {
      startCountdown();
    });

    socket.on('exception', (exception: WsException & { cause: any }) => {
      const { message, cause } = exception;

      alert(message);
      isLoading.value = false;

      switch (cause.pattern) {
        case 'lobby.join':
          router.push({ path: '/', replace: true });
          break;
        default:
          break;
      }
    });
  };

  const startCountdown = () => {
    if (countdownStarted.value) return;

    countdownStarted.value = true;
    counter.value = 5;

    countdownInterval = setInterval(() => {
      counter.value--;
      if (counter.value === -1) {
        clearInterval(countdownInterval!);
        countdownStarted.value = false;
        countdownInterval = null;
        router.push({ path: '/game', replace: true });
      }
    }, 800);
  };

  const createLobby = async () => {
    const response = await socket.emitWithAck(CREATE_LOBBY_EVENT, {
      nickname: playerStore.player.nickname,
    });
    if (response) {
      lobbyState.value = { ...response };
      router.push({ path: `/lobby/${response.id}`, replace: true });
    }
  };

  const joinLobby = async (lobbyCode: string) => {
    if (lobbyState.value?.id === lobbyCode) {
      return;
    }

    try {
      isLoading.value = true;

      const res = (await socket.emitWithAck(JOIN_LOBBY_EVENT, {
        lobbyId: lobbyCode,
        nickname: playerStore.player.nickname,
      })) as {
        id: string;
        ownerId: string;
        players: { id: string; nickname: string }[];
      };

      if (res) {
        lobbyState.value = {
          id: res.id,
          ownerId: res.ownerId,
          players: res.players,
        };

        if (route.params.id !== res.id) {
          router.push({ path: `/lobby/${res.id}`, replace: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const startGame = () => {
    socket.emit('game.create', {
      lobbyId: lobbyState.value?.id,
      players: lobbyState.value?.players,
    });
  };

  return {
    lobbyState,
    createLobby,
    joinLobby,
    bindEvents,
    isLoading,
    startGame,
    counter,
    countdownStarted,
    startCountdown,
  };
});
