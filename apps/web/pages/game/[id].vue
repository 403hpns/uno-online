<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGameStore } from '~/stores/game';
import Table4 from '/images/Table_4.png';

const route = useRoute();
const socketStore = useSocketStore();
const gameStore = useGameStore();

const gameId = route.params.id as string;

onMounted(() => {
  socketStore.connect();
  gameStore.joinGame(gameId);
});
</script>

<template>
  <div
    class="h-screen gap-4 bg-cover bg-center"
    :style="{ backgroundImage: `url(${Table4})` }"
  >
    <div class="container mx-auto grid grid-cols-1 grid-rows-3 h-full">
      <SecondPlayerBoard />
      <div class="flex justify-center items-center gap-24">
        <DiscardAndDrawPile />
        <CurrentColorDisplay />
      </div>

      <PlayerDeck />
    </div>

    <CardColorPicker />
  </div>
</template>
