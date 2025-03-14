<script setup lang="ts">
import { useLobbyStore } from '@/stores/lobby';
import { useRoute } from 'vue-router';

definePageMeta({
  layout: 'main-menu-layout',
});

const socketStore = useSocketStore();
const lobbyStore = useLobbyStore();
const playerStore = usePlayerStore();

const { text, copy, copied } = useClipboard({
  source: lobbyStore.lobbyState?.id!,
});
const route = useRoute();

const copyLobbyCode = () => {
  navigator.clipboard.writeText(lobbyStore.lobbyState?.id || '');
};

onMounted(() => {
  const lobbyId = route.params.id as string;

  if (lobbyId && lobbyId !== lobbyStore.lobbyState?.id) {
    lobbyStore.joinLobby(lobbyId);
  }
});

const MAX_PLAYERS_IN_LOBBY = 2;

onMounted(() => {
  socketStore.connect();
});
</script>

<template>
  <MainMenuLayout>
    <div
      v-if="lobbyStore.isLoading"
      class="flex items-center justify-center gap-2"
    >
      <Icon name="lucide:loader-2" class="animate-spin" />{{
        $t('lobby.loading')
      }}
    </div>
    <div v-else class="flex flex-col gap-4">
      <div class="flex items-center justify-center gap-1.5">
        <h3>
          {{ $t('lobby.title') }}
          <strong class="font-black">#{{ lobbyStore.lobbyState?.id }}</strong>
        </h3>

        <Icon v-if="copied" :size="16" name="lucide:check" />
        <Icon
          v-else
          name="lucide:copy"
          :size="16"
          class="transition-colors cursor-pointer hover:scale-110 hover:text-yellow-500"
          @click="copy()"
        />
      </div>

      <div class="flex flex-col">
        <p class="font-bold">{{ $t('lobby.playerList.label') }}:</p>
        <ul class="mt-2 gap-1.5 flex flex-col">
          <li
            v-for="player in lobbyStore.lobbyState?.players"
            :key="player.id"
            class="flex gap-1"
          >
            {{ player.nickname }}
            <p v-if="player.id === lobbyStore.lobbyState?.ownerId">👑</p>
            <p v-if="player.id === playerStore.player.id">
              ({{ $t('lobby.playerList.you') }})
            </p>
          </li>
        </ul>
      </div>
      <button
        type="button"
        :disabled="
          lobbyStore.lobbyState?.players.length !== MAX_PLAYERS_IN_LOBBY
        "
        class="flex w-full items-center justify-center gap-2.5 rounded-lg bg-yellow-500 px-4 py-3 font-bold uppercase shadow-inner shadow-yellow-400 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:brightness-75"
      >
        <span
          v-if="lobbyStore.lobbyState?.players.length !== MAX_PLAYERS_IN_LOBBY"
        >
          {{ $t('lobby.playBtn.waiting') }} ({{
            lobbyStore.lobbyState?.players.length
          }}/{{ MAX_PLAYERS_IN_LOBBY }})
        </span>
        <button @click="lobbyStore.startGame" v-else>
          {{ $t('lobby.playBtn.start') }}
        </button>
      </button>
    </div>
  </MainMenuLayout>
</template>
