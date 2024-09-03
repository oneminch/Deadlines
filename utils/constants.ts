import type { DeadlineItem, Options } from "./types";
import { DateUtils } from "./date-utils";

const DEADLINES_STORE_KEY = "lf_deadlines";
const OPTIONS_STORE_KEY = "lf_options";

const DEADLINES = [
  "Add new deadlines.",
  "Update the date of a deadline.",
  "Change app preferences using the gear icon at the top.",
  "Export data to / import data from a JSON file.",
  "Purge local data from the dropdown."
];

const DEFAULT_OPTIONS: Options = {
  firstTime: true,
  toastEnabled: true
};

const COLORS = ["#20c997", "#fcc419", "#f06595", "#845ef7"];

const ONBOARDING_DEADLINES = DEADLINES.map((deadline, index) => {
  const d: DeadlineItem = {
    id: `onboarding-${index}`,
    task: deadline,
    date: DateUtils.formatDate(DateUtils.getTomorrow()),
    overdue: false,
    color: circularAccess(COLORS, index)
  };

  return d;
});

export {
  COLORS,
  DEFAULT_OPTIONS,
  ONBOARDING_DEADLINES,
  DEADLINES_STORE_KEY,
  OPTIONS_STORE_KEY
};
