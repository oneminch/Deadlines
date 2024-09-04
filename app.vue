<script lang="ts" setup>
  // const appOptions = ref<Options>();

  // onMounted(async () => {
  //   if (!isDBInitialized.value) {
  //     await loadDeadlines();
  //   }

  //   appOptions.value =
  //     ((await getOfflineData("lf_options")) as Options) || defaultOptions;
  // });

  // const currID = ref(-1);
  // const currDate = ref(offsetedToday());
  // const currIndex = ref(-1);
  // const currColor = ref("#f1c40f");
  // const visibleInput = ref(false);
  // const expandedOptions = ref(false);
  // const format = ref("MMM dd, yyyy");
  // const idList = ref([]);

  // const swatches = ref([
  //   "#1abc9c",
  //   "#16a085",
  //   "#2ecc71",
  //   "#27ae60",
  //   "#3498db",
  //   "#2980b9",
  //   "#9b59b6",
  //   "#8e44ad",
  //   "#f1c40f",
  //   "#f39c12",
  //   "#d35400",
  //   "#e74c3c",
  //   "#ffffff",
  //   "#ecf0f1",
  //   "#bdc3c7",
  //   "#171a1d"
  // ]);
  // const toggleColors = ref({
  //   checked: "#40c057",
  //   unchecked: "#ced4da"
  // });
  // const swatchCSS = ref({
  //   trigger: {
  //     width: "30px",
  //     height: "30px",
  //     margin: "0 auto",
  //     border: "1px solid #a1adb9"
  //   }
  // });
  // const purgeConfirmMessages = ref([
  //   "Purge Database",
  //   "Are you sure?",
  //   "Done!"
  // ]);
  // const width = ref(window.innerWidth);
  // const notify = ref(false);
</script>

<template>
  <main id="app">
    <app-modal />

    <app-header />

    <app-input />

    <app-deadline-list />

    <app-scroll-to-top />
  </main>
</template>

<style>
  @import url("https://overpass-30e2.kxcdn.com/overpass-mono.css");

  /* Import font */
  @font-face {
    font-family: "JetBrains Mono";
    src: url("https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff2/JetBrainsMono-Bold.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff/JetBrainsMono-Bold.woff")
        format("woff");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  /* Import bold font */
  @font-face {
    font-family: "JetBrains Mono";
    src: url("https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff2/JetBrainsMono-ExtraBold.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff/JetBrainsMono-ExtraBold.woff")
        format("woff");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @tailwind utilities;

  @layer utilities {
    .global-focus {
      @apply outline-none ring-2 ring-rose-400 ring-opacity-75 ring-offset-2 ring-offset-white dark:ring-offset-zinc-800;
    }

    .icon-link {
      @apply w-6 h-6 flex items-center justify-center;
    }

    .icon-button {
      @apply text-xl w-10 h-10 flex items-center justify-center *:shrink-0 rounded-xl p-1 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 focus-visible:global-focus;
    }

    .action-item {
      @apply h-8 flex items-center justify-center  *:shrink-0 gap-x-2 rounded-lg py-1 px-3 text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 border border-zinc-300 dark:border-zinc-600 focus-visible:global-focus;
    }
  }

  :root {
    --primary-red-color: #fa5252;
    --primary-green-color: #40c057;
    --overdue-red-color: #e63946;
    --gray-text-color: #748ca3;
  }

  html {
    --text-color: #2c3e50;
    --background-color: #ffffff;
    --gray-border-color: #ced4da;
    --wrapper-border-color: #2c3e50;
    --add-button-background-color: #2c3e50;
    --opt-button-background-color: #ffffff;
    --opt-toggle-background-color: #e9ecef;
  }

  html[data-theme="dark"] {
    --text-color: #ffffff;
    --background-color: #171a1d;
    --gray-border-color: #3e4a57;
    --wrapper-border-color: #3e4a57;
    --add-button-background-color: #3e4a57;
    --opt-button-background-color: #3e4a57;
    --opt-toggle-background-color: #3e4a57;
  }

  * {
    /* transition: all 250ms, color, background-color, border-color,
      text-decoration-color, fill, stroke 100ms; */
  }

  html {
    @apply m-0 p-0;
    font-family: "Space Grotesk", sans-serif;
  }

  body {
    @apply min-w-96 text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900;
  }

  #app {
    @apply antialiased text-center max-w-5xl min-w-80 w-full my-0 mx-auto flex flex-col justify-center gap-y-4 px-4 sm:px-8 lg:px-4 pb-12;
  }

  * {
    @apply box-border transition-colors duration-200 font-mono;
    /* font-family: "JetBrains Mono", "overpass-mono", "Cascadia Mono",
      "Lucida Console", monospace; */
  }
</style>
