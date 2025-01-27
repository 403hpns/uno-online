<script setup lang="ts">
const { id, hoverable = false } = defineProps<{
  id: string;
  hoverable?: boolean;
}>();
</script>
<template>
  <div class="w-32">
    <img
      :src="`/images/cards/${id}.png`"
      alt="UNO Card"
      class="transform duration-300 z-50"
      :class="{
        'hover:-translate-y-4 hover:scale-110 cursor-pointer': hoverable,
      }"
    />
  </div>
</template>
