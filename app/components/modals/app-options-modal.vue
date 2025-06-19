<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog";
  import { Label } from "@/components/ui/label";
  import { Switch } from "@/components/ui/switch";
  import { cn } from "@/lib/utils";

  const props = defineProps<{
    triggerClass?: string;
  }>();

  const { options, updateOptions } = useOptions();
  const { exportData, importData } = useFile();
  const { purgeDeadlines } = useDeadlines();

  const fileInputRef = ref<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    if (fileInputRef.value) {
      fileInputRef.value.click();
    }
  };

  const toastsEnabled = computed({
    get: () => {
      return options.value.toastsEnabled;
    },
    set: async (newValue: boolean) => {
      await updateOptions({ toastsEnabled: newValue });
    }
  });

  const handlePurge = async () => {
    await purgeDeadlines();
  };
</script>

<template>
  <Dialog class="max-w-36">
    <DialogTrigger as-child>
      <Button
        aria-label="Toggle App Options"
        title="Toggle App Options"
        :class="cn('icon-button!', props.triggerClass)">
        <Icon name="ph:gear-six-duotone" />
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-96!">
      <DialogHeader>
        <DialogTitle class="sr-only">App Options</DialogTitle>
      </DialogHeader>

      <div class="options min-w-72 space-y-4 text-sm">
        <h3 class="text-2xl font-bold">Options</h3>

        <div
          class="flex items-center gap-2 justify-between bg-zinc-100 dark:bg-zinc-800 rounded-md py-4 px-6 cursor-pointer">
          <Label for="toggle-toast" class="text-base">Enable Toasts</Label>
          <Switch id="toggle-toast" v-model="toastsEnabled" />
        </div>

        <hr
          class="w-4/5 mx-auto my-4 block border-none bg-linear-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent h-px rounded-full" />

        <button class="action-item w-full!" @click="exportData">
          Export to JSON
        </button>

        <input
          type="file"
          ref="fileInputRef"
          class="sr-only"
          @change="importData" />
        <button class="action-item w-full!" @click="triggerFileInput">
          Import from JSON
        </button>

        <hr
          class="w-4/5 mx-auto my-4 block border-none bg-linear-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent h-px rounded-full" />

        <app-confirmation-button
          class="action-item w-full! bg-red-500/50! hover:bg-red-500! border-red-600!"
          initial-label="Purge Local Data"
          primary-confirmation-label="Are You Sure?"
          secondary-confirmation-label="Are You Sure?"
          @confirmed="handlePurge" />
      </div>
    </DialogContent>
  </Dialog>
</template>
