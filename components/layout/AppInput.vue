<script setup lang="ts">
  const toast = useCustomToast();
  const { addDeadlineItem } = useDeadlines();
  const currentDate = ref<DatePickerModelValue>(null);
  const newEntry = ref("");
  const inputRef = ref<HTMLInputElement | null>(null);

  const createNewDeadline = async (e: Event) => {
    e.preventDefault();

    if (!newEntry.value.trim()) {
      toast.error("Please Enter a Deadline.", true);
      return;
    } else if (!currentDate.value) {
      toast.error("Please Pick a Valid Date.", true);
      return;
    }

    const deadlineItem: DeadlineItem = {
      id: Date.now().toString(),
      task: newEntry.value,
      date: currentDate.value as Date
    };

    newEntry.value = "";
    currentDate.value = null;

    await addDeadlineItem(deadlineItem);
  };

  onMounted(() => {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });
  });
</script>

<template>
  <form
    class="w-full bg-transparent flex flex-col items-center gap-y-4"
    @submit="createNewDeadline">
    <input
      type="text"
      v-model="newEntry"
      ref="inputRef"
      placeholder="Enter a Deadline"
      aria-label="Enter a Deadline"
      class="w-full h-10 text-base flex items-center justify-center rounded py-1 px-3 text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-600 focus-visible:global-focus" />

    <app-date-picker
      class="flex! sm:hidden!"
      :date="currentDate"
      :is-inline="false"
      @update:date="(date) => (currentDate = date)" />

    <app-date-picker
      class="hidden! sm:flex!"
      :date="currentDate"
      :is-inline="true"
      @update:date="(date) => (currentDate = date)" />

    <button
      class="action-item w-full! h-10! bg-violet-500! text-zinc-50! border-none!">
      Create
    </button>
  </form>
</template>
