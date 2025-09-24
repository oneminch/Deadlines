<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib/utils";

  const props = defineProps<{
    triggerClass?: string;
  }>();

  const aboutModalProps = {
    title: "About",
    description: "Information about the app."
  };
</script>

<template>
  <app-modal v-bind="aboutModalProps">
    <template #trigger>
      <Button
        aria-label="Toggle App Information"
        title="Toggle App Information"
        :class="cn('icon-button!', props.triggerClass)">
        <Icon name="ph:info-duotone" />
      </Button>
    </template>

    <section
      class="w-full sm:w-auto h-auto min-h-56 flex flex-col gap-y-4 justify-between">
      <img src="/logo.svg" alt="Logo" class="mx-auto w-12 h-12" />
      <p class="text-center">
        Deadlines is a minimal, offline deadline tracker.
      </p>
      <p class="text-center">
        All data is stored locally in the browser 🔐. You can import & export
        your deadlines from & to a JSON file. It also comes with dark mode 🌓.
      </p>
      <div class="*:action-item my-4 flex items-center justify-center gap-x-4">
        <nuxt-link
          aria-label="NuxtJS Website"
          target="_blank"
          title="Nuxt"
          to="https://github.com/oneminch/Deadlines"
          external
          class="bg-zinc-950! text-zinc-100! border-zinc-500! hover:bg-zinc-800!">
          <span>GitHub</span>
          <Icon name="ph:github-logo-duotone" />
        </nuxt-link>
      </div>
      <nuxt-link
        aria-label="Product Hunt Launch Website"
        target="_blank"
        title="Featured On Product Hunt"
        to="https://www.producthunt.com/posts/deadlines-950fa45d-e41f-417f-a661-7a26f861c4b2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-deadlines-950fa45d-e41f-417f-a661-7a26f861c4b2"
        class="inline-block mx-auto border-2 border-[#ff6154] rounded-xl">
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=278969&theme=dark"
          alt="Deadlines - A simple, offline deadline tracker | Product Hunt"
          style="width: 250px; height: 54px"
          width="250"
          height="54" />
      </nuxt-link>
      <p
        class="text-base text-zinc-500 mt-6 dark:text-zinc-500 flex justify-center items-center font-medium gap-2 justify-self-end">
        Built with
        <nuxt-link
          class="icon-link focus-visible:global-focus border-b border-dotted border-current text-[#00DC82]"
          to="https://nuxt.com/"
          aria-label="NuxtJS Website"
          target="_blank"
          title="Nuxt"
          external>
          <Icon name="simple-icons:nuxtdotjs" />
        </nuxt-link>
        <span>&amp;</span>
        <nuxt-link
          class="icon-link focus-visible:global-focus border-b border-dotted border-current text-[#38bdf8]"
          to="https://tailwindcss.com/"
          aria-label="Tailwind CSS Website"
          target="_blank"
          title="Tailwind CSS"
          external>
          <Icon name="simple-icons:tailwindcss" />
        </nuxt-link>
      </p>
    </section>
  </app-modal>
</template>
