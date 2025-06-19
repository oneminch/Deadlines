<script setup lang="ts">
  import type { DatePickerModelValue } from "../utils/types";

  const props = withDefaults(
    defineProps<{
      date: DatePickerModelValue;
      isInline?: boolean;
    }>(),
    {
      isInline: false
    }
  );

  const emit = defineEmits<{
    (e: "update:date", value: Date): void;
  }>();

  const localDate = computed({
    get: () => {
      return props.date;
    },
    set: (newDate: Date) => {
      emit("update:date", newDate);
    }
  });
</script>

<template>
  <DatePicker
    v-model="localDate"
    dateFormat="M d, yy"
    :manualInput="false"
    :class="{
      'icon-button focus-within:global-focus w-auto! h-10! max-w-52 overflow-hidden':
        !isInline
    }"
    :inputClass="{
      'flex! items-center! justify-center! gap-x-2! rounded! text-zinc-900! dark:text-zinc-50! bg-transparent! shadow-none! text-center! w-full! focus-visible:outline-none border-none! cursor-pointer [&+span]:h-full [&+span]:top-0 [&+span]:mt-0 [&+span]:flex [&+span]:items-center [&+span]:justify-center':
        !isInline
    }"
    :inline="isInline"
    fluid
    showIcon
    iconDisplay="input"
    ariaLabel="Pick a Date"
    placeholder="Pick a Date" />
</template>
