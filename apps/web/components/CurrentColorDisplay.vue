<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { computed } from 'vue';

const gameStore = useGameStore();

type Color = 'Red' | 'Blue' | 'Green' | 'Yellow';

const colorClasses: Record<Color, string> = {
  Red: 'bg-red-500',
  Blue: 'bg-blue-500',
  Green: 'bg-green-500',
  Yellow: 'bg-yellow-500',
};

const isSelectingColor = computed(() => gameStore.isColorPickerVisible);
</script>

<template>
  <div class="flex items-center justify-center gap-12">
    <div
      class="w-20 h-20 rotate-45 rounded-2xl shadow-xl transition-all"
      :class="{
        [colorClasses[gameStore.gameState?.currentColor as Color]]:
          !isSelectingColor,
        'color-animation': isSelectingColor,
      }"
    />
  </div>
</template>

<style scoped>
.color-animation {
  background: linear-gradient(135deg, #ff0000, #ffea00, #00ff00, #0077ff);
  background-size: 400% 400%;
  animation: gradient-move 6s ease-in-out infinite alternate;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

@keyframes gradient-move {
  0% {
    background-position: 0% 0%;
    transform: rotate(0deg) scale(1);
  }
  50% {
    background-position: 100% 100%;
    transform: rotate(10deg) scale(1.1);
  }
  100% {
    background-position: 0% 100%;
    transform: rotate(-10deg) scale(1);
  }
}
</style>
