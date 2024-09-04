<script lang="ts" setup>
  import type { DeadlineItem } from "~/utils/types";

  const { deadlines, deleteDeadlineItem, updateDeadlineItem } = useDeadlines();

  const handleItemDelete = async (deadlineId: string) => {
    await deleteDeadlineItem(deadlineId);
  };

  const handleItemUpdate = async (deadline: DeadlineItem) => {
    await updateDeadlineItem(deadline);
  };
</script>

<template>
  <div
    class="w-full rounded-lg py-4 px-8 border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 flex flex-col">
    <template v-if="deadlines.length > 0">
      <app-deadline-item
        v-for="(deadline, index) in deadlines"
        :key="index"
        :deadline="deadline"
        @delete="handleItemDelete"
        @update="handleItemUpdate" />
    </template>

    <template v-else>
      <div class="min-h-32 flex items-center justify-center">
        <h2 class="text-3xl font-semibold text-zinc-400 dark:text-zinc-600">
          No upcoming deadlines 🌴
        </h2>
      </div>
    </template>
  </div>
</template>
