<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib/utils";

  const props = defineProps<{
    triggerClass?: string;
  }>();

  const inputModalProps = {
    title: "Create New Deadlines",
    description: "Use the input field and date picker to create a new deadline."
  };
</script>

<template>
  <app-modal v-bind="inputModalProps">
    <template #trigger>
      <Button
        aria-label="Toggle Input"
        title="Toggle Input"
        :class="cn('icon-button!', props.triggerClass)">
        <Icon name="ph:plus-bold" />
      </Button>
    </template>

    <section
      class="w-full sm:w-sm h-[50%] sm:h-auto min-h-36 sm:py-6 p-2 flex flex-col gap-y-4 justify-between">
      <app-input />
    </section>
  </app-modal>
</template>
