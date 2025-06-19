<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog";
  import { cn } from "@/lib/utils";

  const props = defineProps<{
    triggerClass?: string;
  }>();
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        aria-label="Toggle Input"
        title="Toggle Input"
        :class="cn('icon-button!', props.triggerClass)">
        <Icon name="ph:plus-bold" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="sr-only">Create New Deadlines</DialogTitle>
      </DialogHeader>

      <section
        class="w-full sm:w-auto h-[50%] sm:h-auto min-h-36 sm:py-6 p-2 flex flex-col gap-y-4 justify-between">
        <app-input />
      </section>
    </DialogContent>
  </Dialog>
</template>
