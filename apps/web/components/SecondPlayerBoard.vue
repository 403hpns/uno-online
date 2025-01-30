<script setup lang="ts">
const playerStore = usePlayerStore();
const gameStore = useGameStore();

const secondPlayer = computed(() => {
  return gameStore.gameState?.players.find(
    (player) => player.id !== playerStore.player.id
  );
});
</script>

<template>
  <div class="flex flex-col col-span-1 justify-center gap-2">
    <p
      class="font-black text-xl"
      :class="{
        'opacity-50': gameStore.gameState?.currentPlayer !== secondPlayer?.id,
      }"
    >
      {{ secondPlayer?.nickname }}
    </p>
    <div class="flex items-center justify-center">
      <Card
        v-for="card in secondPlayer?.cards"
        id="Deck"
        :key="`card-${card}`"
      />
    </div>
  </div>
</template>
