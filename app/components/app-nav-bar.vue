<template>
  <div
    class="flex items-center gap-x-2 fixed bottom-4 left-1/2 overflow-hidden transform -translate-x-1/2">
    <div
      class="flex sm:hidden items-center gap-x-2 shadow-md rounded-full p-2 sm:p-1 bg-violet-50 dark:bg-zinc-900 border-2 sm:border border-violet-500">
      <app-input-toggle class="rounded-full! sm:hidden" />
      <app-about-toggle class="rounded-full! sm:hidden" />
      <app-theme-toggle class="rounded-full! sm:hidden" />
      <app-options-toggle class="rounded-full! sm:hidden" />
    </div>
    <app-scroll-to-top />
  </div>
</template>
