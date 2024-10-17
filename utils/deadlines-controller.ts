import type { DeadlineItem } from "~/utils/types";
import OfflineDB from "./db";
import { DEADLINES_STORE_KEY, ONBOARDING_DEADLINES } from "~/utils/constants";

export default class {
  private db: OfflineDB;

  constructor(dbInstance: LocalForage) {
    this.db = new OfflineDB(dbInstance);
  }

  public initializeDeadlinesStore = async () => {
    return await this.db.initializeKVStore(
      DEADLINES_STORE_KEY,
      ONBOARDING_DEADLINES
    );
  };

  public getDeadlines = async (): Promise<DeadlineItem[]> => {
    return (
      ((await this.db.getOfflineData(DEADLINES_STORE_KEY)) as DeadlineItem[]) ||
      []
    );
  };

  public setDeadlines = async (deadlines: DeadlineItem[]) => {
    await this.db.setOfflineData(DEADLINES_STORE_KEY, deadlines);
  };
}
