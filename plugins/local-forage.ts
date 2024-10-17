import localforage from "localforage";

export default defineNuxtPlugin(() => {
  const offlineDB = localforage.createInstance({
    name: "OfflineData",
    storeName: "offline_db",
    description: "Used to store all data: Deadlines and User Settings."
  });

  return {
    provide: { offlineDB }
  };
});
