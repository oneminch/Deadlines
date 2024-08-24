// import {
//   format,
//   addHours,
//   startOfDay,
//   isBefore,
//   compareAsc,
//   startOfToday,
//   formatDistanceStrict,
//   isToday
// } from "date-fns";
// import type { DeadlineItem } from "./types";

class DateUtils {
  //   // Offset date by 12 hours from its start
  //   static offsetDate = (date: Date) => {
  //     if (isToday(date)) {
  //       return addHours(startOfToday(), 12);
  //     } else {
  //       return addHours(startOfDay(date), 12);
  //     }
  //   };

  //   // Offset today's date by 12 hours
  //   static offsetedToday = () => {
  //     return this.offsetDate(startOfToday());
  //   };

  //   // Update current date with offset
  //   static newDate = (value: Date) => {
  //     // this.currDate = this.offsetDate(value);
  //     return this.offsetDate(value);
  //   };

  //   static getFormattedToday = () => {
  //     return format(this.offsetedToday(), "MMM d, yyyy");
  //   };

  //   static isDeadlineOverdue = (deadline: DeadlineItem): boolean => {
  //     let d = deadline.date;

  //     if (isBefore(d, this.offsetedToday()) || isToday(d)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };

  //   // Displays days left/passed for each deadline
  //   static getRemainingDays = (date: Date): string => {
  //     if (isToday(date)) {
  //       return "Today (0 days left)";
  //     } else {
  //       return formatDistanceStrict(this.offsetDate(date), this.offsetedToday(), {
  //         unit: "day",
  //         addSuffix: true
  //       });
  //     }
  //   };

  // Get Random Date
  static getRandomDate = () => {
    const start = new Date(2012, 0, 1),
      end = new Date();

    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  // Get Tomorrow's Date
  static getTomorrow = () => {
    return ((d) => new Date(d.setDate(d.getDate() + 1)))(new Date());
  };

  // Format Date
  static formatDate = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };
}

export { DateUtils };
