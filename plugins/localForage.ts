import localforage from "localforage";

export default defineNuxtPlugin(() => {
  const deadlinesStore = localforage.createInstance({
    name: "DeadlinesData",
    storeName: "deadlines_db",
    description: "Used to store the list of deadlines."
  });

  const optionsStore = localforage.createInstance({
    name: "OptionsData",
    storeName: "options_db",
    description:
      "Used to store the preferences for dark mode and notifications."
  });

  return {
    provide: { deadlinesStore, optionsStore }
  };
});
