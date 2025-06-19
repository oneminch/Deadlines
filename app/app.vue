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
  @reference "./assets/css/main.css";

  .p-toast-detail {
    @apply text-zinc-900! dark:!text-zinc-50;
  }

  [tabindex="-1"] {
    @apply focus-visible:outline-none;
  }
</style>
