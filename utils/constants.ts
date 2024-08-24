import type { DeadlineItem, Options } from "./types";
import { DateUtils } from "./date-utils";

const DEADLINES_STORE_KEY = "lf_deadlines";
const OPTIONS_STORE_KEY = "lf_options";

const DEADLINES = [
  "Add a new deadline using the button above.",
  "Update the date of each deadline or delete it using the button next to it.",
  "Change preferences using the dropdown located at the bottom right.",
  "Import from or export to a JSON file using the options from the dropdown.",
  "You can also purge your local data from the dropdown."
];

const DEFAULT_OPTIONS: Options = {
  firstTime: true,
  toastEnabled: true,
  darkThemeEnabled: false
};

const COLORS = ["#1abc9c", "#3498db", "#f1c40f", "#f39c12", "#2c3e50"];

const ONBOARDING_DEADLINES = DEADLINES.map((deadline) => {
  const d: DeadlineItem = {
    id: `demo-${Math.random()}`,
    task: deadline,
    date: DateUtils.formatDate(DateUtils.getTomorrow()),
    overdue: false,
    color: COLORS.pop() || "#fff"
  };

  return d;
});

export {
  DEFAULT_OPTIONS,
  ONBOARDING_DEADLINES,
  DEADLINES_STORE_KEY,
  OPTIONS_STORE_KEY
};
