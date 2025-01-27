<script setup lang="ts">
import { onUnmounted, watch } from 'vue';

const {
  isOpen,
  title,
  closeable = true,
} = defineProps<{
  isOpen: boolean;
  title: string;
  closeable?: boolean;
}>();

const emit = defineEmits(['update:isOpen']);

const close = () => {
  if (closeable) emit('update:isOpen', false);
};

watch(
  () => isOpen,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

onUnmounted(() => {
  document.body.style.overflow = 'auto';
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-brightness-50 backdrop-blur-xl"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div
        class="m-8 relative w-full max-w-2xl rounded-2xl border bg-black/5 p-8 shadow-xl"
        @keydown.esc="close"
        tabindex="0"
      >
        <button
          v-if="closeable"
          @click="close"
          class="cursor-pointer absolute right-4 top-4 text-neutral-200 hover:text-gray-800 focus:outline-none focus:ring focus:ring-gray-300"
          aria-label="Close modal"
        >
          <Icon name="lucide:x" />
        </button>

        <h2
          id="modal-title"
          class="flex items-center gap-3.5 text-xl font-black text-white"
        >
          <span class="relative flex size-3">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
            />
            <span class="relative inline-flex size-3 rounded-full bg-red-500" />
          </span>

          {{ title }}
        </h2>
        <p class="mt-4 text-neutral-100">
          <slot />
        </p>
      </div>
    </div>
  </Teleport>
</template>
