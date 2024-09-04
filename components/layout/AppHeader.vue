<script lang="ts" setup>
  import { DateUtils } from "~/utils/date-utils";
</script>

<template>
  <header
    class="w-full my-8 mx-auto flex justify-between items-start select-none font-semibold text-3xl">
    <div class="flex flex-col gap-y-2 text-left text-3xl">
      <h2 class="flex items-center gap-x-2">
        <span>Deadlines</span>
        <Icon name="ph:hourglass-simple-low-fill" />
      </h2>
      <h2 class="text-zinc-500 dark:text-zinc-500">
        {{ DateUtils.formatDate(new Date()) }}
      </h2>
    </div>

    <div class="flex items-center gap-x-2">
      <app-about-toggle />
      <app-theme-toggle />
      <app-options-toggle />
    </div>
  </header>
</template>
