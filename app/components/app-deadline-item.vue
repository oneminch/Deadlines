<script lang="ts" setup>
  import type { DeadlineItem } from "~/utils/types";
  import { isOverdue } from "~/utils/helpers";
  import { DateUtils } from "~/utils/date-utils";

  const props = defineProps<{ deadline: DeadlineItem }>();

  const emit = defineEmits<{
    (e: "update", deadline: DeadlineItem): void;
    (e: "delete", deadlineId: string): void;
  }>();

  const onDateUpdate = (newDate: Date) => {
    props.deadline.date = newDate;

    emit("update", props.deadline);
  };

  const onDelete = () => {
    emit("delete", props.deadline.id);
  };
</script>

<template>
  <li
    class="w-full flex flex-col items-start gap-y-4 gap-x-0 sm:flex-row sm:items-center sm:justify-between sm:gap-y-0 sm:gap-x-2 py-4 border-b border-b-zinc-100 dark:border-b-zinc-700 last:border-none">
    <p
      class="w-full text-left pl-4 border-l-4 border-zinc-300 dark:border-zinc-600"
      :class="{
        'border-red-500!': isOverdue(deadline.date)
      }">
      <span :title="deadline.task" class="font-semibold">
        {{ deadline.task }}
      </span>
      <br />
      <span class="text-sm text-zinc-500">{{
        DateUtils.getRemainingDays(deadline.date)
      }}</span>
    </p>
    <div
      class="flex items-center justify-between w-full sm:w-auto gap-x-4 shrink-0 *:shrink-0">
      <app-date-picker
        :date="deadline.date !== null ? new Date(deadline.date) : null"
        @update:date="onDateUpdate" />

      <app-confirmation-button
        class="icon-button hover:bg-red-500/50! hover:border-red-600!"
        confirmation-class="bg-red-500/50! border-red-600!"
        initial-label="Delete Item"
        primary-confirmation-label="?"
        secondary-confirmation-label="Are You Sure?"
        @confirmed="onDelete">
        <Icon name="ph:trash-duotone" />
      </app-confirmation-button>
    </div>
  </li>
</template>
