<script setup lang="ts">
const { disabled } = defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <button type="button" :disabled="disabled"><slot /></button>
</template>
