<script lang="ts" setup>
  // if it's user's first time, save preferences
  // if (options.firstTime) {
  //   options.firstTime = false;
  // }
  const { isOpen, closeModal, component, props } = useModal();
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
        class="fixed inset-0 flex items-end justify-center md:items-center bg-zinc-50/75 dark:bg-zinc-900/75 backdrop-blur-sm"
        @click="closeModal">
        <div
          class="relative w-full md:w-3/5 h-2/3 md:h-auto min-h-48 max-w-3xl rounded-t-lg md:rounded-lg py-8 px-12 flex flex-col gap-y-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 transform"
          @click.stop>
          <button
            class="icon-button !hidden md:!flex absolute top-2 right-2 !rounded-full"
            aria-label="Close Modal"
            title="Close Modal"
            @click="closeModal">
            <Icon name="ph:x" />
          </button>
          <component :is="component" v-bind="props" />
          <button
            class="action-item mt-6 mx-auto !h-10 !px-6 !flex md:!hidden !rounded-full"
            @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
