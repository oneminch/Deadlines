<script setup lang="ts">
  const { options, updateOptions } = useOptions();
  const { exportData, importData } = useFile();
  const { purgeDeadlines } = useDeadlines();
  const { closeModal } = useModal();

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
    closeModal();
  };
</script>

<template>
  <div class="options min-w-72 space-y-4">
    <h3 class="text-2xl font-bold">Options</h3>
    <label
      class="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-md py-4 px-6 cursor-pointer">
      <p>Enable Toasts</p>
      <ToggleSwitch v-model="toastsEnabled" />
    </label>

    <hr
      class="w-4/5 mx-auto my-4 block border-none bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent h-[1px] rounded-full" />

    <button class="action-item !w-full" @click="exportData">
      Export to JSON
    </button>

    <input
      type="file"
      ref="fileInputRef"
      class="sr-only"
      @change="importData" />
    <button class="action-item !w-full" @click="triggerFileInput">
      Import from JSON
    </button>

    <hr
      class="w-4/5 mx-auto my-4 block border-none bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent h-[1px] rounded-full" />

    <app-confirmation-button
      class="action-item !w-full !bg-red-500/50 hover:!bg-red-500 !border-red-600"
      initial-label="Purge Local Data"
      primary-confirmation-label="Are You Sure?"
      secondary-confirmation-label="Are You Sure?"
      @confirmed="handlePurge" />
  </div>
</template>
