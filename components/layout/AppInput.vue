<script lang="ts" setup>
  import type { DeadlineItem } from "~/utils/types";
  import { DateUtils } from "~/utils/date-utils";
  import DatePicker from "primevue/datepicker";

  const currentDate = ref();

  const createRandomDeadline = (): DeadlineItem => {
    const randomThreeDigitInteger = () =>
      (Math.floor(Math.random() * 900) + 100).toString();

    const id = randomThreeDigitInteger();

    return {
      id,
      task: `Task - ${id}`,
      date: DateUtils.formatDate(DateUtils.getRandomDate()),
      color: "#edae49",
      overdue: false
    };
  };

  const { addDeadlineItem, purgeDeadlines, hardPurgeDeadlines } =
    useDeadlines();

  const addNewDeadline = async (e: Event) => {
    e.preventDefault();

    await addDeadlineItem(createRandomDeadline());
  };

  const purgeDB = async (e: Event) => {
    e.preventDefault();

    await purgeDeadlines();
  };

  const hardPurgeDB = async (e: Event) => {
    e.preventDefault();

    await hardPurgeDeadlines();
  };
</script>

<template>
  <form
    class="w-full rounded-lg p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 flex flex-col gap-y-4">
    <input
      type="text"
      placeholder="Enter a Deadline"
      aria-label="Enter a Deadline"
      class="h-9 flex items-center justify-center rounded-lg py-1 px-3 text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-600 focus-visible:global-focus" />

    <div class="flex items-center gap-x-4 *:w-1/2">
      <app-date-picker />
      <!-- <app-date-picker /> -->
      <!-- :pt="datePickerStyles" -->
      <button class="action-item" @click="addNewDeadline">Add</button>
      <button class="action-item" @click="purgeDB">Soft Purge</button>
      <button class="action-item" @click="hardPurgeDB">Hard Purge</button>
    </div>
    <!-- <button
      v-if="!visibleInput"
      @click="
        visibleInput = true;
        expandedOptions = false;
      "
    >
      Add New Deadline
    </button>
    <div v-else class="add-deadline">
      <div class="first">
        <input
          ref="input"
          type="text"
          placeholder="Enter deadline..."
          maxlength="100"
          autofocus
        />
      </div>
      <div class="second">
        <div>
          <datepicker
            :format="format"
            :value="currDate"
            @selected="newDate"
            calendar-class="calendar-class"
            input-class="input-class"
            content="Pick date"
            v-tippy
          ></datepicker>
          <button content="Pick color" title="Pick color">
            <v-swatches
              v-model="currColor"
              show-fallback
              :swatch-size="35"
              :trigger-style="swatchCSS.trigger"
              show-border
              shapes="circles"
              :swatches="swatches"
            ></v-swatches>
          </button>
        </div>
        <div>
          <div>
            <tippy v-if="!isSmallScreen" to="addNew">Add New</tippy>
            <button name="addNew" @click="addNewDeadline">
              <img src="/add.svg" alt="Add Icon" />
              <span>Add</span>
            </button>
          </div>

          <div>
            <tippy v-if="!isSmallScreen" to="Cancel">Cancel</tippy>
            <button
              name="Cancel"
              @click="
                visibleInput = false;
                expandedOptions = false;
              "
            >
              <img src="/cancel.svg" alt="Cancel Icon" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </form>
</template>
