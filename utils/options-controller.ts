import type { Options } from "~/utils/types";
import OfflineDB from "./db";
import { DEFAULT_OPTIONS, OPTIONS_STORE_KEY } from "~/utils/constants";

export default class {
  private db: OfflineDB;

  constructor(dbInstance: LocalForage) {
    this.db = new OfflineDB(dbInstance);
  }

  public initializeOptionsStore = async () => {
    try {
      await this.db.initializeKVStore(OPTIONS_STORE_KEY, DEFAULT_OPTIONS);
    } catch (error) {
      console.error("Error Initializing Options Store:", error);
    }
  };

  public getOptions = async (): Promise<Options> => {
    return ((await this.db.getOfflineData(OPTIONS_STORE_KEY)) as Options) || [];
  };

  public setOptions = async (options: Options) => {
    await this.db.setOfflineData(OPTIONS_STORE_KEY, options);
  };
}
