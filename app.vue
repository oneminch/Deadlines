<script lang="ts" setup>
  import "@fontsource/inter/400.css";
  import "@fontsource/inter/500.css";
  import "@fontsource/inter/600.css";
  import "@fontsource/inter/700.css";
</script>

<template>
  <main id="app">
    <app-modal />

    <app-header />

    <app-deadline-list />

    <app-nav-bar />

    <Toast position="bottom-center" class="w-80 sm:w-96" />
  </main>
</template>

<style>
  @tailwind utilities;

  @layer utilities {
    .global-focus {
      @apply outline-none ring-2 ring-violet-500 ring-opacity-75 ring-offset-2 ring-offset-white dark:ring-offset-zinc-800;
    }

    .icon-link {
      @apply w-6 h-6 flex items-center justify-center;
    }

    .icon-button {
      @apply w-10 h-10 flex items-center justify-center *:shrink-0 rounded p-1 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 focus-visible:global-focus text-xl;
    }

    .action-item {
      @apply h-8 flex items-center justify-center *:shrink-0 gap-x-2 rounded py-1 px-3 text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 border border-zinc-300 dark:border-zinc-600 focus-visible:global-focus;
    }
  }

  * {
    @apply box-border transition-all duration-200;
  }

  html {
    @apply m-0 p-0;
  }

  body {
    @apply font-mono min-w-80 text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900;
  }

  #app {
    @apply antialiased text-center max-w-5xl min-w-80 w-full my-0 mx-auto flex flex-col justify-center gap-y-4 px-4 sm:px-8 lg:px-4 pb-16;
  }

  .p-toast-detail {
    @apply !text-zinc-900 dark:!text-zinc-50;
  }

  [tabindex="-1"] {
    @apply focus-visible:outline-none;
  }
</style>
