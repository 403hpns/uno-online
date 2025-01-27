<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useGameStore } from '~/stores/game';
import Table4 from '/images/Table_4.png';

type DeckCardColor = 'yellow' | 'green' | 'blue' | 'red';

const route = useRoute();
const gameStore = useGameStore();
const playerStore = usePlayerStore();

const gameId = route.params.id as string;
const currentColor = ref<DeckCardColor>('yellow');

const socketStore = useSocketStore();

onMounted(() => {
  socketStore.connect();
  gameStore.joinGame(gameId);
});

const playCard = (card: string) => {
  gameStore.playCard(gameId, card);
};

const drawCard = () => {
  gameStore.drawCard(gameId);
};

const isValidMove = (playerCard: string) => {
  if (!gameStore.gameState?.discardPile.length) {
    return true;
  }

  const [playerColor, playerValue] = playerCard.split('_');
  const [deckColor, deckValue] =
    gameStore.gameState.discardPile[
      gameStore.gameState.discardPile.length - 1
    ].split('_');

  if (playerValue === 'Draw4') {
    return true;
  }

  return playerColor === deckColor || playerValue === deckValue;
};

const currentPlayer = computed(() => {
  return gameStore.gameState?.players.find(
    (player) => player.token === playerStore.user.token
  );
});
const secondPlayer = computed(() => {
  return gameStore.gameState?.players.find(
    (player) => player.token !== playerStore.user.token
  );
});
</script>

<template>
  <div
    class="h-screen gap-4 bg-cover bg-center"
    :style="{ backgroundImage: `url(${Table4})` }"
  >
    <div
      v-if="false"
      class="max-h-full gap-4 flex flex-col items-center justify-center fixed m-4 top-0 left-0 bg-black/10 backdrop-blur-3xl p-4 rounded-lg"
    >
      <span class="font-black">DEBUG GAME DATA</span>
      <pre class="overflow-scroll">
        <p class="font-bold">Current client:</p>
        {{
          JSON.stringify(
            gameStore.gameState?.players.find(
              (player) => player.token === playerStore.user.token
            ),
            null,
            2
          )
        }}
     
     <p class="font-bold">Game state:</p>

        {{ JSON.stringify(gameStore.gameState, null, 2) }}
      </pre>
    </div>

    <div class="container mx-auto grid grid-cols-1 grid-rows-3 h-full">
      <!-- Karty przeciwnika (zakryte) -->
      <div class="col-span-1 flex items-center justify-center">
        <Card
          v-for="card in secondPlayer?.cards"
          :id="card"
          :key="`card-${card}`"
        />
      </div>

      <!-- Środkowa część boardu -->
      <div class="flex items-center justify-center gap-12">
        <!-- Dobieranie kart -->
        <Card id="Deck" @click="drawCard" :hoverable="true" />

        <!-- Karty na stole -->
        <div
          v-if="gameStore.gameState?.discardPile.length"
          class="w-16 h-24 bg-white rounded-lg shadow-md"
          :style="{ backgroundColor: currentColor }"
        >
          <img
            :src="`/images/cards/${gameStore.gameState.discardPile[gameStore.gameState.discardPile.length - 1]}.png`"
            alt="Card"
            class="w-full h-full"
          />
        </div>

        <!-- Kolor aktualnej karty -->
        <div
          class="aspect-square w-12 rounded-full shadow-xl"
          :class="{
            'bg-red-500': currentColor === 'red',
            'bg-blue-500': currentColor === 'blue',
            'bg-green-500': currentColor === 'green',
            'bg-yellow-500': currentColor === 'yellow',
          }"
        />
      </div>

      <!-- Karty gracza -->
      <div class="col-span-1 flex items-center justify-center z-50">
        <Card
          v-for="card in currentPlayer?.cards"
          :id="card"
          :key="`card-${card}`"
          :hoverable="true"
          @click="playCard(card)"
        />
      </div>
    </div>
  </div>
</template>
