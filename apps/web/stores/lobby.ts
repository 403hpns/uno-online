import { socket } from '@/lib/socket';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { LobbyState } from '~/interfaces/lobby';
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

    socket.on('exception', (exception: WsException) =>
      alert(exception.message)
    );
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

  const joinLobby = (lobbyCode: string) => {
    if (lobbyState.value?.id === lobbyCode) {
      return;
    }

    isLoading.value = true;

    socket.emit(
      JOIN_LOBBY_EVENT,
      { lobbyId: lobbyCode, nickname: playerStore.player.nickname },
      (response: {
        id: string;
        ownerId: string;
        players: { id: string; nickname: string }[];
      }) => {
        lobbyState.value = {
          id: response.id,
          ownerId: response.ownerId,
          players: response.players,
        };

        if (route.params.id !== response.id) {
          router.push({ path: `/lobby/${response.id}`, replace: true });
        }

        isLoading.value = false;
      }
    );
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
