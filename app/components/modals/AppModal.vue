<script lang="ts" setup>
  import { ref, watch, nextTick } from "vue";
  const { isOpen, closeModal, component, props } = useModal();

  const modalContainer = ref<HTMLElement | null>(null);

  // Ensure modal is focused when toggled
  watch(isOpen, (newValue) => {
    if (newValue) {
      nextTick(() => {
        modalContainer.value?.focus();
      });
    }
  });

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleEscapeKey);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleEscapeKey);
  });
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-linear"
      leave-active-class="transition-opacity duration-200 ease-linear"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-end justify-center sm:items-center bg-zinc-50/75 dark:bg-zinc-900/75 backdrop-blur-sm"
        @click="closeModal">
        <div
          class="relative w-full sm:w-auto h-auto max-w-3xl rounded-t-lg sm:rounded-lg p-6 sm:py-8 sm:px-12 flex flex-col gap-y-4 justify-between bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 transform overflow-auto"
          tabindex="-1"
          ref="modalContainer"
          @click.stop>
          <button
            class="icon-button border-none! bg-transparent! hidden! sm:flex! absolute top-2 right-2 rounded-full!"
            aria-label="Close Modal"
            title="Close Modal"
            @click="closeModal">
            <Icon name="ph:x" />
          </button>
          <component :is="component" v-bind="props" />
          <button
            class="icon-button mt-6 mx-auto text-xs! w-auto! h-8! px-4! flex! md:hidden! rounded-full!"
            @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
