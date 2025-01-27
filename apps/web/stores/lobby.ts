import { socket } from '@/lib/socket';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePlayerStore } from './player';
const CREATE_LOBBY_EVENT = 'lobby.create';
const JOIN_LOBBY_EVENT = 'lobby.join';

interface CreateLobbyDto {
  id: string;
  players: { id: string; username: string }[];
}

type LobbyPlayer = {
  id: string;
  username: string;
};

type LobbyState = {
  id: string;
  players: LobbyPlayer[];
};

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
      lobbyState.value = { id: data.id, players: [...data.players] };
    });

    socket.on('game.start', async () => {
      console.log('Game is starting...');
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
      username: playerStore.nickname,
    });

    if (response) {
      lobbyState.value = { id: response.id, players: response.players };
      router.push({ path: `/lobby/${response.id}`, replace: true });
    }
  };

  const joinLobby = (lobbyCode: string) => {
    console.log('[LOBBY] joinLobby fn executed | ', lobbyCode);

    if (lobbyState.value?.id === lobbyCode) {
      console.log('[LOBBY] Lobby already mounted.');
      return;
    }

    isLoading.value = true;

    console.log('[LOBBY] Sending join event via WS...');

    socket.emit(
      JOIN_LOBBY_EVENT,
      { lobbyId: lobbyCode, username: playerStore.nickname },
      (response: {
        id: string;
        players: { id: string; username: string }[];
      }) => {
        console.log('[LOBBY] Joined to lobby. Response data: ', response);

        lobbyState.value = {
          id: response.id,
          players: response.players,
        };

        console.log('Updated lobbyState:', lobbyState.value);

        if (route.params.id !== response.id) {
          router.push({ path: `/lobby/${response.id}`, replace: true });
        }

        isLoading.value = false;
      }
    );
  };

  const startGame = () => {
    console.log('Starting game...');
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
