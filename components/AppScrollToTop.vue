<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from "vue";

  const showButton = ref(false);

  const handleScroll = () => {
    showButton.value = window.scrollY > 100;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
</script>

<template>
  <button
    v-show="showButton"
    @click="scrollToTop"
    class="action-item fixed bottom-7 left-1/2 overflow-hidden transition-all duration-300 ease-in-out transform -translate-x-1/2 shadow-md !rounded-full !px-6 !h-10 !gap-x-0 !bg-rose-50 dark:!bg-zinc-900 !border-rose-200 dark:!border-rose-500 group"
    aria-label="Scroll to Top">
    <span
      class="w-0 mr-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out sm:group-hover:mr-2 sm:group-hover:w-32"
      >Scroll to Top</span
    >
    <Icon name="ph:caret-line-up" class="text-lg" />
  </button>
</template>
