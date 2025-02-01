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

const { setLocale } = useI18n();
</script>

<template>
  <MainMenuLayout>
    <button @click="setLocale('en')">en</button>
    <button @click="setLocale('pl')">pl</button>

    <component @changeTab="goToTab" :is="tabs[currentTab]" />
  </MainMenuLayout>
</template>
