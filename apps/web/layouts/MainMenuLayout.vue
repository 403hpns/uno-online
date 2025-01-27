<script setup lang="ts">
import MenuBg from '/images/uno-bg.jpg';

const showModal = ref(true);
</script>

<template>
  <div
    class="relative h-screen before:absolute before:scale-110 before:bg-cover before:bg-center"
    :style="{ '--bg-image': `url(${MenuBg})` }"
    style="--tw-bg-opacity: 1; background-image: var(--bg-image)"
  >
    <div
      class="flex h-screen items-center justify-center backdrop-blur-xl backdrop-brightness-90"
    >
      <div class="flex flex-col gap-12">
        <MenuLogo />

        <div class="min-w-[450px] rounded-xl bg-black/10 p-8 shadow-2xl">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
