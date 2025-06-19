import { DateUtils } from "./date-utils";

const circularAccess = <T>(arr: Array<T>, index: number) =>
  arr[((index % arr.length) + arr.length) % arr.length];

const isOverdue = (date: Date) => {
  return DateUtils.isDateOnOrBeforeToday(date);
};

export { circularAccess, isOverdue };
