<script setup lang="ts">
import MenuBg from '/images/uno-bg.jpg';
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
      <LocalizationPicker />
      <div class="flex flex-col gap-12 container mx-6">
        <MenuLogo />
        <div
          class="rounded-xl bg-black/10 p-8 shadow-2xl w-full md:w-md mx-auto"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
