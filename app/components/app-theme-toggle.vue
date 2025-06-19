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
    class="icon-button"
    @click="onClick">
    <ColorScheme placeholder="...">
      <Icon v-if="colorMode.preference === 'dark'" name="ph:moon-duotone" />
      <Icon v-else name="ph:sun-duotone" />
    </ColorScheme>
  </button>
</template>
