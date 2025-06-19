<script lang="ts" setup>
  import "@fontsource/inter/400.css";
  import "@fontsource/inter/500.css";
  import "@fontsource/inter/600.css";
  import "@fontsource/inter/700.css";
  import { Toaster } from "@/components/ui/sonner";
  import "vue-sonner/style.css";
</script>

<template>
  <main id="app">
    <app-header />

    <app-deadline-list />

    <app-nav-bar />

    <Toaster />
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
