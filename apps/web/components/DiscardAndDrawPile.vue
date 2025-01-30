<script setup lang="ts">
const gameStore = useGameStore();

const drawCard = () => {
  gameStore.drawCard();
};
</script>

<template>
  <div class="flex gap-4">
    <!-- Draw cards -->
    <Card id="Deck" @click="drawCard" :hoverable="true" />

    <!-- Discard pile -->
    <Card
      v-if="gameStore.gameState?.discardPile.length"
      :id="
        gameStore.gameState.discardPile[
          gameStore.gameState.discardPile.length - 1
        ]
      "
    />
  </div>
</template>
