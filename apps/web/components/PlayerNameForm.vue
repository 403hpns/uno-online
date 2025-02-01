<script setup lang="ts">
const socketStore = useSocketStore();
const playerStore = usePlayerStore();

const emit = defineEmits(['changeTab']);

const $handleTabChange = () => {
  if (!playerStore.player.nickname.trim().length) {
    alert('Wprowadź prawidłowy nickname');
    return;
  }

  socketStore.connect();
  emit('changeTab', 'LobbyStatus');
};
</script>

<template>
  <form class="flex flex-col gap-2">
    <label for="nickname">{{ $t('menu.form.nickname.label') }}</label>
    <UiInput
      v-model="playerStore.player.nickname"
      name="nickname"
      placeholder="Co0lGuy77"
    />

    <button
      type="button"
      :disabled="!playerStore.player.nickname.length"
      @click="$handleTabChange"
      class="flex items-center justify-center gap-2.5 rounded-lg bg-yellow-500 px-4 py-3 font-bold uppercase shadow-inner shadow-yellow-400 transition hover:bg-yellow-400"
    >
      <Icon name="lucide:tv-minimal-play" />
      {{ $t('menu.form.nickname.playBtn') }}
    </button>
  </form>
</template>
