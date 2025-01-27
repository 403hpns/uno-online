<script setup lang="ts">
import MainMenuLayout from '@/layouts/MainMenuLayout.vue';

import { useLobbyStore } from '@/stores/lobby';
import { useRoute } from 'vue-router';

const lobbyStore = useLobbyStore();

const route = useRoute();

const copyLobbyCode = () => {
  navigator.clipboard.writeText(lobbyStore.lobbyState?.id || '');
};

watchEffect(() => {
  const lobbyId = route.params.id as string;

  if (lobbyId) {
    lobbyStore.joinLobby(lobbyId);
  }
});

const MAX_PLAYERS_IN_LOBBY = 2;
</script>

<template>
  <MainMenuLayout>
    <div
      v-if="lobbyStore.isLoading"
      class="flex items-center justify-center gap-2"
    >
      <Icon name="lucide:loader-2" class="animate-spin" />Trwa ładowanie...
    </div>
    <div v-else class="flex flex-col gap-4">
      <div class="flex items-center justify-center gap-1.5">
        <h3>
          Pokój gry
          <strong class="font-black">#{{ lobbyStore.lobbyState?.id }}</strong>
        </h3>

        <Icon
          name="lucide:copy"
          :size="16"
          class="cursor-pointer hover:scale-110 hover:text-yellow-500"
          @click="copyLobbyCode"
        />
      </div>

      <div class="flex flex-col">
        <p class="font-bold">Gracze:</p>
        <ul>
          <li v-for="player in lobbyStore.lobbyState?.players" :key="player.id">
            {{ player.username }}
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
          Oczekiwanie na graczy ({{ lobbyStore.lobbyState?.players.length }}/{{
            MAX_PLAYERS_IN_LOBBY
          }})
        </span>
        <button @click="lobbyStore.startGame" v-else>Rozpocznij grę</button>
      </button>
    </div>
  </MainMenuLayout>
</template>
