<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { computed } from 'vue';

const gameStore = useGameStore();

const colors = ['Red', 'Green', 'Blue', 'Yellow'] as const;

const colorClasses: Record<(typeof colors)[number], string> = {
  Red: 'bg-red-500',
  Green: 'bg-green-500',
  Blue: 'bg-blue-500',
  Yellow: 'bg-yellow-500',
};

const isVisible = computed(() => gameStore.isColorPickerVisible);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 flex items-center justify-center backdrop-brightness-50"
    >
      <div
        class="w-96 flex flex-col items-center rounded-xl backdrop-blur-sm p-8 bg-white/10"
      >
        <h2 class="text-lg font-semibold mb-4">Wybierz kolor</h2>

        <div class="flex gap-4">
          <button
            v-for="color in colors"
            :key="color"
            class="hover:scale-110 cursor-pointer transition transform"
            :class="['w-12 h-12 rounded-full', colorClasses[color]]"
            :aria-label="`Kolor ${color}`"
            @click="gameStore.pickColor(color)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
