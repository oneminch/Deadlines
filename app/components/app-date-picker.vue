<script setup lang="ts">
  import { computed } from "vue";
  import { cn } from "~/lib/utils";
  import { Button } from "@/components/ui/button";
  import { Calendar } from "@/components/ui/calendar";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger
  } from "@/components/ui/popover";
  import type { DatePickerModelValue } from "~/utils/types";
  import {
    CalendarDate,
    // type DateValue,
    getLocalTimeZone,
    parseDate
  } from "@internationalized/date";
  import { type DateValue, parseStringToDateValue, toDate } from "reka-ui/date";

  const props = withDefaults(
    defineProps<{
      date: DatePickerModelValue;
      isInline?: boolean;
      class?: string;
    }>(),
    {
      isInline: false
    }
  );

  const emit = defineEmits<{
    (e: "update:date", value: Date): void;
  }>();

  const localDateValue = computed({
    get: () =>
      props.date ? parseDate(props.date.toISOString().slice(0, 10)) : undefined,
    set: (newVal: DateValue) => {
      if (newVal) {
        emit("update:date", toDate(newVal));
      }
    }
  });

  const df = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long"
  });
</script>

<template>
  <div v-if="isInline" class="w-full">
    <Calendar
      v-model="localDateValue"
      initial-focus
      class="flex flex-col items-center rounded border border-zinc-200 dark:border-zinc-700" />
  </div>
  <Popover :class="cn(props.class)" v-else>
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :class="
          cn(
            'font-normal w-40 h-10 *:shrink-0 rounded-sm text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 focus-visible:global-focus! pr-6 max-w-52 overflow-hidden text-center focus-visible:outline-none gap-2',
            !localDateValue && 'text-muted-foreground'
          )
        ">
        <Icon name="ph:calendar-blank-duotone" class="size-5" />
        {{ localDateValue ? df.format(toDate(localDateValue)) : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        v-model="localDateValue"
        class="rounded-md border border-zinc-200 dark:border-zinc-700 shadow"
        initial-focus />
    </PopoverContent>
  </Popover>
</template>
