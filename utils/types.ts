import type { NuxtApp } from "#app";

interface CustomNuxtApp extends NuxtApp {
  $offlineDB: LocalForage;
}

interface DeadlineItem {
  id: string;
  task: string;
  date: string;
  overdue: boolean;
  color: string;
}

interface Options {
  firstTime?: boolean;
  toastEnabled?: boolean;
}

type DBResponseType = DeadlineItem[] | Options | null;

export type { DeadlineItem, Options, DBResponseType, CustomNuxtApp };
