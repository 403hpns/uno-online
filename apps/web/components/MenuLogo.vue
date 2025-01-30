<script setup lang="ts">
const colors = ['blue', 'red', 'yellow', 'green'];
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="text-center">
      <p class="text-7xl font-black">UNO</p>
      <p class="text-3xl font-black uppercase leading-none">Online</p>
    </div>

    <div class="flex items-center justify-center gap-2">
      <span
        v-for="(color, index) in colors"
        :key="index"
        class="h-3 w-3 rounded-full"
        :class="`bg-${color}-500`"
      />
    </div>
  </div>
</template>
