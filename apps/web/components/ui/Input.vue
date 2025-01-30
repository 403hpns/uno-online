<script setup lang="ts">
const { placeholder } = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const $updateInputValue = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit('update:modelValue', input.value);
};
</script>

<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    :placeholder="placeholder"
    @input="$updateInputValue"
    class="bg-white text-dark rounded-xl p-2 text-black"
  />
</template>
