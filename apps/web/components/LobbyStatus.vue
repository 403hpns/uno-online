<script setup lang="ts">
import { useLobbyStore } from '@/stores/lobby';
import { ref } from 'vue';

const lobbyStore = useLobbyStore();
const lobbyCode = ref('');
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label>{{ $t('menu.form.lobbyCode.label') }}</label>
        <UiInput v-model="lobbyCode" placeholder="np. 8stRE4Je" />

        <button
          @click="lobbyStore.joinLobby(lobbyCode)"
          class="flex w-full items-center justify-center gap-2.5 rounded-lg bg-yellow-500 px-4 py-3 font-bold uppercase shadow-inner shadow-yellow-400 transition hover:bg-yellow-400"
        >
          <Play />
          <Icon name="lucide:play" />
          {{ $t('menu.form.lobbyCode.joinBtn') }}
        </button>
      </div>

      <span class="h-px w-full bg-neutral-200 opacity-50" />

      <button
        @click="lobbyStore.createLobby"
        class="flex w-full items-center justify-center gap-2.5 rounded-lg bg-green-500 px-4 py-3 font-bold uppercase shadow-inner shadow-green-400 transition hover:bg-green-400"
      >
        <Icon name="lucide:plus" />
        {{ $t('menu.form.lobbyCode.createBtn') }}
      </button>
    </div>
  </div>
</template>
