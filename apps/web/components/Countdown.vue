<script setup lang="ts">
import { watch } from 'vue';
import { useLobbyStore } from '~/stores/lobby';

const lobbyStore = useLobbyStore();

watch(
  () => lobbyStore.countdownStarted,
  (newVal) => {
    if (newVal) {
      lobbyStore.startCountdown();
    }
  }
);
</script>

<template>
  <div
    v-if="lobbyStore.countdownStarted"
    class="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-3xl text-7xl font-black"
  >
    <p class="animate-ping duration-100" v-if="lobbyStore.counter > 0">
      {{ lobbyStore.counter }}
    </p>
    <p class="animate-ping" v-else>START</p>
  </div>
</template>
