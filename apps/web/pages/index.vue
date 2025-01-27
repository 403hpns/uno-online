<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'main-menu-layout',
});

const LobbyStatus = resolveComponent('LobbyStatus');
const PlayerNameForm = resolveComponent('PlayerNameForm');

const tabs = {
  PlayerNameForm,
  LobbyStatus,
};

const currentTab = ref<keyof typeof tabs>('PlayerNameForm');

function goToTab(tab: keyof typeof tabs) {
  currentTab.value = tab;
}
</script>

<template>
  <MainMenuLayout>
    <component :change-tab="goToTab" :is="tabs[currentTab]" />
  </MainMenuLayout>
</template>
