<script setup lang="ts">
import { socket } from '~/lib/socket';

const playerStore = usePlayerStore();
const lobbyStore = useLobbyStore();
const gameStore = useGameStore();

socket.off();
playerStore.bindEvents();
lobbyStore.bindEvents();
gameStore.bindEvents();
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
