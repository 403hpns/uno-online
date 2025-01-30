<script setup lang="ts">
const playerStore = usePlayerStore();
const gameStore = useGameStore();
</script>

<template>
  <div class="flex flex-col col-span-1 justify-center gap-2">
    <p
      class="font-black text-xl"
      :class="{
        'opacity-50':
          gameStore.gameState?.currentPlayer !== playerStore?.player.id,
      }"
    >
      {{ playerStore.player?.nickname }}
    </p>
    <div class="col-span-1 flex items-center justify-center">
      <Card
        v-for="card in gameStore.gameState?.players.find(
          (player) => player.id === playerStore.player.id
        )?.cards"
        :id="card"
        :key="`card-${card}`"
        :hoverable="true"
        @click="gameStore.playCard(card)"
      />
    </div>
  </div>
</template>
