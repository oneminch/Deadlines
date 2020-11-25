import localForage from "localforage";

// Create store for storing deadlines
const deadlines_db = localForage.createInstance({
	storeName: "deadlines_db",
	description: "Used to store the list of deadlines.",
});

// Create store for storing options
const options_db = localForage.createInstance({
	storeName: "options_db",
	description:
		"Used to store the preferences for dark mode and notifications.",
});

export { deadlines_db, options_db };
