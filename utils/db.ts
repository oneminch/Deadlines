import type { DBResponseType, DeadlineItem, Options } from "~/utils/types";

export default class {
  private dbInstance: LocalForage;

  constructor(dbInstance: LocalForage) {
    this.dbInstance = dbInstance;
  }

  public initializeKVStore = async (
    storeKey: string,
    defaultData: DeadlineItem[] | Options
  ) => {
    let data = (await this.dbInstance.getItem(storeKey)) as typeof defaultData;

    if (data === null) {
      await this.dbInstance.setItem(storeKey, defaultData);
    }
  };

  public getOfflineData = async (key: string): Promise<DBResponseType> => {
    try {
      return await this.dbInstance.getItem(key);
    } catch (error) {
      console.error("Error Getting Offline Data:", error);
      return null;
    }
  };

  public setOfflineData = async (
    key: string,
    payload: DeadlineItem[] | Options
  ) => {
    try {
      await this.dbInstance.setItem(key, payload);
    } catch (error) {
      console.error("Error Setting Offline Data:", error);
    }
  };

  public hardPurgeOfflineData = async () => {
    await this.dbInstance.clear();
  };
}
