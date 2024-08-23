<script setup lang="ts">
  const colorMode = useColorMode();
  const onClick = () => {
    const values = ["light", "dark"];
    const index = values.indexOf(colorMode.preference);
    const next = (index + 1) % values.length;

    colorMode.preference = values[next];
  };
</script>

<template>
  <button
    aria-label="Toggle Color Mode"
    title="Toggle Color Mode"
    class="text-base w-8 h-8 flex items-center justify-center rounded-lg p-1 text-neutral-900 dark:text-neutral-50 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus-visible:global-focus"
    @click="onClick"
  >
    <ColorScheme placeholder="...">
      <Icon v-if="colorMode.preference === 'dark'" name="uil:moon" />
      <Icon v-else name="uil:sun" />
    </ColorScheme>
  </button>
</template>
