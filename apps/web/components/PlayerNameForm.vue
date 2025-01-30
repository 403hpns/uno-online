<script setup lang="ts">
import { socket } from '~/lib/socket';

const props = defineProps<{
  changeTab: (tab: string) => void;
}>();

const socketStore = useSocketStore();
const playerStore = usePlayerStore();

function handlePlay() {
  socket.auth = {
    nickname: playerStore.player.nickname,
    token: playerStore.player.token,
  };
  socket.connect();

  if (playerStore.player.nickname.trim().length > 0) {
    props.changeTab('LobbyStatus');
  }
}
</script>

<template>
  <form class="flex flex-col gap-2">
    <label for="nickname">Nazwa</label>
    <UiInput v-model="playerStore.player.nickname" placeholder="RandomGuy444" />

    <button
      type="button"
      @click="handlePlay"
      class="flex items-center justify-center gap-2.5 rounded-lg bg-yellow-500 px-4 py-3 font-bold uppercase shadow-inner shadow-yellow-400 transition hover:bg-yellow-400"
    >
      <Icon name="lucide:tv-minimal-play" />
      Graj
    </button>
  </form>
</template>
