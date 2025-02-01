<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, setLocale } = useI18n();
const isOpen = ref(false);

type Language = {
  code: 'pl' | 'en';
  name: string;
  flag: string;
};

const languages: Language[] = [
  {
    code: 'pl',
    name: 'Polski',
    flag: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F015%2F272%2F069%2Foriginal%2Fpoland-3d-rounded-flag-with-transparent-background-free-png.png&f=1&nofb=1&ipt=e720de855e918c7c9d31c6348be2bf2cd7b51ea9e12c4434ba9d78db377d7122&ipo=images',
  },
  {
    code: 'en',
    name: 'English',
    flag: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F015%2F272%2F027%2Fnon_2x%2Funited-states-3d-rounded-flag-with-transparent-background-free-png.png&f=1&nofb=1&ipt=e7e774d7423451b24354bf2db6b444a6dd3a1d7eb7a0b7092e5c0093cb33374d&ipo=images',
  },
] as const;

const currentLanguage = computed(() =>
  languages.find((l) => l.code === locale.value)
);

const toggleDropdown = () => (isOpen.value = !isOpen.value);
</script>

<template>
  <div class="fixed top-0 right-0 m-4">
    <button
      @click="toggleDropdown"
      class="size-12 hover:scale-105 transition-transform duration-150 cursor-pointer"
      :aria-label="currentLanguage?.name"
    >
      <img
        :src="currentLanguage?.flag"
        :alt="currentLanguage?.name"
        class="object-cover"
      />
    </button>

    <transition
      enter-active-class="transition-opacity duration-100 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute top-full right-0 mt-2 flex flex-col z-50"
      >
        <button
          v-for="lang in languages"
          v-show="lang.code !== locale"
          :key="lang.code"
          @click="
            setLocale(lang.code);
            isOpen = false;
          "
          class="hover:scale-105 transition-transform duration-150 cursor-pointer"
          :aria-label="lang.name"
        >
          <img
            :src="lang.flag"
            :alt="lang.name"
            class="object-cover shadow-sm"
          />
        </button>
      </div>
    </transition>
  </div>
</template>
