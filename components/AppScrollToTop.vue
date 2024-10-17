<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from "vue";

  const enableButton = ref(false);

  const handleScroll = () => {
    enableButton.value = window.scrollY > 100;
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
  <div
    class="flex items-center gap-x-2 shadow-md rounded-full p-2 sm:p-1 bg-violet-50 dark:bg-zinc-900 border-2 sm:border border-violet-500"
    :class="{ hidden: !enableButton }">
    <button
      v-show="enableButton"
      @click="scrollToTop"
      class="action-item overflow-hidden transition-all duration-300 ease-in-out shadow-md !rounded-full hover:!px-6 !w-10 hover:!w-auto !h-10 !gap-x-0 sm:group"
      aria-label="Scroll to Top">
      <span
        class="w-0 mr-0 overflow-hidden whitespace-nowrap transition-all duration-100 ease-in-out sm:group-hover:mr-2 sm:group-hover:w-32"
        >Scroll to Top</span
      >
      <Icon name="ph:caret-line-up" class="text-lg" />
    </button>
  </div>
</template>
