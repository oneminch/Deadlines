<template>
	<div id="app">
		<div class="header">
			<h2>Deadlines <span title="Work In Progress">(WIP)</span> <img src="./assets/logo.png" alt="Logo" /></h2>
			<h2>{{ displayToday() }}</h2>
		</div>
		<div class="full list" @click="collapseOptions">
			<button v-if="!visibleInput" @click="visibleInput = true; expandedOptions = false;">
				Add New Deadline
			</button>
			<div v-else class="add-deadline">
				<div class="first">
					<input ref="input" type="text" placeholder="Enter deadline..." autofocus/>
				</div>
				<div class="second">
					<div>
						<datepicker
							:format="format"
							:value="currDate"
							@selected="newDate"
							content="Pick date"
							v-tippy
						></datepicker>
						<button content="Pick color" title="Pick color">
							<v-swatches 
								v-model="currColor" 
								show-fallback 
								:swatch-size="35" 
								:trigger-style="{ width: '30px', height: '30px', margin: '0 auto' }" 
								show-border 
								shapes="circles"
								:swatches="swatches"
							></v-swatches>
						</button>
					</div>
					<div>
						<div>
							<tippy v-if="!isSmallScreen" to="addNew">Add New</tippy>
							<button name="addNew" @click="addNewDeadline">
								<img src="./assets/add.svg" alt="Add Icon" />
								<span>Add</span>
							</button>
						</div>

						<div>
							<tippy v-if="!isSmallScreen" to="Cancel">Cancel</tippy>
							<button name="Cancel" @click="visibleInput = false; expandedOptions = false;">
								<img src="./assets/cancel.svg" alt="Cancel Icon" />
								<span>Cancel</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<hr />
			<div
				v-for="(deadline, index) in deadlines"
				:key="deadline.id"
				:class="[
					'deadline',
					{ 'last-deadline': index === deadlines.length - 1 },
					{ invisible: isListEmpty },
				]"
			>
				<div class="first" :class="{ overdue: deadline.overdue }">
					<div class="color-code" :style="{ 'background-color': deadline.color }"></div>
					<div class="deadline-details">
						<span :title="deadline.task" class="truncate-text">
							{{ deadline.task }}
						</span>
						<span>{{ displayRemainingDays(deadline.date) }}</span>
					</div>
				</div>
				<div class="second" @click="currID = deadline.id">
					<datepicker
						:format="format"
						:value="deadline.date"
						@selected="updateDeadline"
					></datepicker>
					<button
						@click="
							currID = deadline.id;
							deleteDeadline();
						"
						content="Delete"
						v-tippy
					>
						<img src="./assets/trash.svg" alt="Trash Icon" />
					</button>
				</div>
			</div>
			<div :class="['empty', 'list', { invisible: !isListEmpty }]">
				<h2>You have no deadlines...🌴</h2>
			</div>
		</div>
		<div class="options" :class="{ 'options-expanded' : expandedOptions, 'options-collapsed' : !expandedOptions }">
			<button class="toggle-options" @click="expandedOptions = !expandedOptions; ">
				<span>Options</span>
				<img v-if="!expandedOptions" src="./assets/chevron-down.svg" alt="Options Icon" />
				<img v-else src="./assets/chevron-up.svg" alt="Options Icon" />
			</button>
			<div class="toast-toggle">
				<span>Toasts</span>
				<VueToggles
					@click="options.toastEnabled = !options.toastEnabled"
					:value="options.toastEnabled"
					height="30"
					width="50"
					checkedBg="#2c3e50"
					uncheckedBg="lightgrey"
				/>
			</div>
			<div class="theme-toggle">
				<span>Dark Mode</span>
				<VueToggles
					@click="options.darkThemeEnabled = !options.darkThemeEnabled"
					:value="options.darkThemeEnabled"
					height="30"
					width="50"
					checkedBg="#2c3e50"
					uncheckedBg="lightgrey"
				/>
			</div>			
			<button class="export-data" @click="exportData">
				Export to JSON
			</button>
			<button class="import-data">
				<label>Import from JSON<input type="file"  @change="importData"></label>
			</button>
			<vue-confirmation-button
				:class="'purge-data'"
				ref="purgeConfirmationButton"
				:messages="purgeConfirmMessages"
				v-on:confirmation-success="purgeDatabase()">
			</vue-confirmation-button>
		</div>
	</div>
</template>

<script>
	import { 
		format, 
		addHours, 
		startOfDay, 
		isBefore, 
		compareAsc, 
		startOfToday, 
		formatDistanceStrict, 
		isToday 
	} from "date-fns";
	import nid from "nid";
	import { schema } from "./helpers/schema"
	import { deadlines_db, options_db } from "./helpers/localdb";

	export default {
		name: "App",
		data() {
			return {
				currID: -1,
				currDate: this.offsetedToday(),
				currIndex: -1,
				currColor: "#2c3e50",
				visibleInput: false,
				expandedOptions: false,
				format: "MMM dd, yyyy",
				idList: [],
				deadlines: [],
				options: {
					toastEnabled: true,
					darkThemeEnabled: false
				},
				swatches: [
					"#1abc9c",
					"#16a085",
					"#2ecc71",
					"#27ae60",
					"#3498db",
					"#2980b9",
					"#9b59b6",
					"#8e44ad",
					"#f1c40f",
					"#f39c12",
					"#d35400",
					"#e74c3c",
					"#ecf0f1",
					"#bdc3c7",
					"#95a5a6",
					"#2c3e50"
				],
				purgeConfirmMessages: [
					'Purge Database',
					'Are you sure?',
					'Done!'
				],
				width: window.innerWidth
			};
		},
		methods: {
			// Offset date by 12 hours from its start
			offsetDate: function(date) {
				if (isToday(date)) {
					return addHours(startOfToday(), 12);
				} else {
					return addHours(startOfDay(date), 12);
				}
			},
			// Offset today's date by 12 hours
			offsetedToday: function() {
				return this.offsetDate(startOfToday());
			},
			// Update current date with offset
			newDate: function(value) {
				this.currDate = this.offsetDate(value);
			},
			// Display today's date
			displayToday: function() {
				return format(this.offsetedToday(), "MMM d, yyyy");
			},
			// Initialize offline database
			initDatabase: function() {
				let vm = this;

				deadlines_db
					.getItem("deadlines")
					.then(function(db) {
						// offline store for deadlines doesn't exist; initialize
						if (db === null) {
							deadlines_db
								.setItem("deadlines", [])
								.then((value) => {
									vm.populateDeadlines(value);
								})
								.catch((err) => {
									// error setting up db
									vm.$toast.error("Error setting up local database for deadlines.");
									throw err;
								});
						} else {
							vm.populateDeadlines(db);
						}
					})
					.catch(function(err) {
						// if there are any errors
						vm.$toast.error("Error setting up local database for deadlines.");
						throw err;
					});

				options_db
					.getItem("options")
					.then(function(db) {
						// offline store for options doesn't exist; initialize
						if (db === null) {
							options_db
								.setItem("options", vm.options)
								.then((value) => {
									vm.populateOptions(value);
								})
								.catch((err) => {
									// error setting up db
									vm.$toast.error("Error setting up local database for preferences.");
									throw err;
								});
						} else {
							vm.populateOptions(db);
						}
					})
					.catch(function(err) {
						// if there are any errors
						vm.$toast.error("Error setting up local database.");
						throw err;
					});
			},
			// Sorts list of deadlines
			sortDeadlines: function() {
				if (this.deadlines.length > 1) {
					this.deadlines.sort(
						(a, b) => compareAsc(a.date, b.date)
					);
				}
			},
			// Fetches and populate deadlines from offline store
			// Extracts & populates uniques ids from deadlines list
			// Updates overdue status for each deadline
			populateDeadlines: function(data) {
				if (data.length === 0) {
					return;
				}
				
				for (let i = 0; i < data.length; i++) {
					if (this.idList.indexOf(data[i].id) < 0) {
						this.idList.push(data[i].id);
						data[i].date = new Date(data[i].date);
						data[i].overdue = this.isOverdue(data[i]);
						this.deadlines.push(data[i]);
					}
				}

				// sort deadlines
				this.sortDeadlines();
			},
			// Fetches and populate user preferences from offline store
			populateOptions: function(data) {
				if (data.length === 0) {
					return;
				}

				this.options.toastEnabled = data.toastEnabled;
				this.options.darkThemeEnabled = data.darkThemeEnabled;
			},
			// Purges offline database and updates array
			purgeDatabase: function() {
				let vm = this;

				deadlines_db
					.clear()
					.then(function() {
						// update array once db is cleared
						vm.deadlines = [];
						vm.idList = [];
						vm.deadlines.length = 0;
						if (vm.options.toastEnabled) {
							vm.$toast.error("Local database purged.");
						}
					})
					.catch(function(err) {
						// if any errors happened
						vm.$toast.error("Unable to purge database.");
						throw err;
					});
				
				// collapse menu options and reset button
				this.collapseOptions();
			},
			// Update offline database for deadlines
			updateDatabase: function(notify = true) {
				let vm = this;

				deadlines_db
					.setItem("deadlines", this.deadlines)
					.then(() => {
						if (vm.options.toastEnabled && notify) {
							vm.$toast.success("Local database successfully updated.");
						}
					})
					.catch((err) => {
						vm.$toast.error("Unable to update local database.");
						throw err;
					});
			},
			// Checks if deadline at index is overdue
			isOverdue: function(deadline) {
				let d = deadline.date;

				if (isBefore(d, this.offsetedToday()) || isToday(d)) {
					return true;
				} else {
					return false;
				}
			},
			// Displays days left/passed for each deadline
			displayRemainingDays: function(date) {
				if (isToday(date)) {
					return "Today (0 days left)"
				} else {
					return formatDistanceStrict(
						this.offsetDate(date),
						this.offsetedToday(),
						{ 
							unit: 'day',
							addSuffix: true
						}
					);
				}
			},
			// Create and add a new deadline
			addNewDeadline: function() {				
				if (!this.$refs.input.value.trim()) {
					return;
				}

				// create deadline object
				let d = {};
				d.task = this.$refs.input.value.trim();
				d.date = new Date(this.currDate);
				d.overdue = this.isOverdue(d);
				d.color = this.currColor;

				// keep updating id as long as it's not unique
				do {
					d.id = nid();
				} while (this.idList.indexOf(d.id) >= 0);

				// push to list, update database and unique IDs list
				this.idList.push(d.id);
				this.deadlines.push(d);

				// sort deadlines and update offline db
				this.sortDeadlines();
				this.updateDatabase();

				// reset inputs
				this.currDate = this.offsetedToday();
				this.$refs.input.value = "";
			},
			// Update a deadline when the date is changed via its datepicker
			updateDeadline: function(value) {
				// Find index of clicked deadline
				this.currIndex = this.deadlines.findIndex(
					(d) => d.id === this.currID
				);

				// Update the date and overdue status
				let d = this.deadlines[this.currIndex];
				d.date = this.offsetDate(value);
				d.overdue = this.isOverdue(d);

				// sort deadlines and update offline db
				this.sortDeadlines();
				this.updateDatabase();
			},
			// Deletes a deadline
			deleteDeadline: function() {
				// Find index of clicked deadline
				this.currIndex = this.deadlines.findIndex(
					(d) => d.id === this.currID
				);

				// Delete deadline and its id from respective arrays
				if (this.currIndex > -1) {
					let idIndex = this.idList.indexOf(this.currID);
					this.idList.splice(idIndex, 1);
					this.deadlines.splice(this.currIndex, 1);
				}

				// Update database
				this.updateDatabase();
			},
			// Export data to a JSON file
			exportData: function() {
				// collapse menu options and reset button
				this.collapseOptions();

				if (this.isListEmpty) {
					this.$toast.error("Nothing to export.");
					return;
				}

				let dataStr = JSON.stringify(this.deadlines);
				let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

				let exportFileName = 'deadlines.json';

				let linkElement = document.createElement('a');
				linkElement.setAttribute('href', dataUri);
				linkElement.setAttribute('download', exportFileName);
				linkElement.click();
			},
			// Import data from a JSON file
			importData: function(e) {
				// collapse menu options and reset button
				this.collapseOptions();

				let vm = this;

				let file = e.target.files[0];
				if (!file) {
					return;
				}

				// validate file type is JSON before import
				let extension = file.name.split('.').pop().toLowerCase(),
					mediaType = file.type.toLowerCase();

				if (
					extension.match('json') && 
					mediaType.localeCompare('application/json') === 0
				) {
					let reader = new FileReader();
					reader.onload = function(e) {
						let contents = e.target.result;
						let validatedContents = vm.validatedFileContents(contents);

						// if data is valid, populate and update db
						if (Array.isArray(validatedContents)) {
							vm.populateDeadlines(validatedContents);
							vm.updateDatabase(false);
							vm.$toast.success(`Imported ${validatedContents.length} Deadline(s) Successfully.`);
						} else if (validatedContents !== -1) {
							// show error unless error already shown
							vm.$toast.error("Unable to Import: Invalid File Contents.");
						}						
					}

					reader.readAsText(file);
				} else {
					vm.$toast.error("Unable to Import: Invalid File Type.");
				}
			},
			// Validate data schema found in imported files
			validatedFileContents: function(data) {
				// if content of file is empty
				if (!data.trim()) {
					this.$toast.error("Nothing to Import: Empty File.");
					return -1; // to prevent double toastifications
				}

				// parse file contents
				let parsedJSON = JSON.parse(data.trim());

				if (Array.isArray(parsedJSON)) {
					if (parsedJSON.length === 0) {
						this.$toast.error("Nothing to Import: Empty File.");
						return -1; // to prevent double toastifications
					}
					
					// create a new array containing validated objects
					const filtered = parsedJSON.filter(item => {
						if (typeof item === 'object' && item !== null) {
							return schema.validate(item).length === 0;
						}
					});

					return (filtered.length > 0) ? filtered : undefined;
				} else {
					this.$toast.error("Unable to Import: Invalid File Contents.");
					return -1; // to prevent double toastifications
				}
			},
			// Collapse menu options
			collapseOptions: function() {
				this.expandedOptions = false;
			}
		},
		watch: {
			visibleInput: function() {
				// focus input when visible
				if (this.visibleInput) {
					setTimeout(() => {
						this.$refs.input.focus();
					}, 1000);
				}
			},
			expandedOptions: function() {
				// resets confirmation button for purging database
				if(!this.expandedOptions) {
					this.$refs.purgeConfirmationButton.reset();
				}				
			},
			options: {
				// update offline store when preferences change
				handler: function() {
					options_db.setItem("options", this.options);
				},
				deep: true
			},
		},
		computed: {
			// Check if there are any deadlines
			isListEmpty: function() {
				return this.deadlines.length === 0;
			},
			isSmallScreen: function() {
				return this.width <= 540;
			}
		},
		beforeMount() {
			this.initDatabase();
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.width = window.innerWidth;
			});
			// let htmlElt = this.$el.parentElement.parentElement;
			// let bodyElt = this.$el.parentElement;
			// bodyElt.style.backgroundColor = "#ffffff";
			// htmlElt.setAttribute("data-theme","dark");
			// htmlElt.classList.add("dark");

			// htmlElt.removeAttribute("theme");
			// console.log(htmlElt);
		},
	};
</script>

<style>
	@import url('https://overpass-30e2.kxcdn.com/overpass-mono.css');

	/* Import font */
	@font-face {
		font-family: 'JetBrains Mono';
		src: url('https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff2/JetBrainsMono-Bold.woff2') format('woff2'),
			url('https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff/JetBrainsMono-Bold.woff') format('woff');
		font-weight: 500;
		font-style: normal;
		font-display: swap;
	}

	/* Import bold font */
	@font-face {
		font-family: 'JetBrains Mono';
		src: url('https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff2/JetBrainsMono-ExtraBold.woff2') format('woff2'),
			url('https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff/JetBrainsMono-ExtraBold.woff') format('woff');
		font-weight: 600;
		font-style: normal;
		font-display: swap;
	}

	/* html, body {
		background-color: #fff;
		background-color: red;
	}

	html[theme='dark-mode'] {
		filter: invert(1) hue-rotate(180deg);
	}	

	html[theme='dark-mode'] body {
		filter: invert(1) hue-rotate(180deg);
	} */

	/* html.dark body {
		background: #000;
	} */

	/* .vue-switcher {

		border: .1px solid green !important;
	} */

	.vue-switcher-theme--custom.vue-switcher-color--dark div {
		/* background-color: #40c057; */

		background-color: #2c3e50;
		/* box-shadow: 2px 2px 5px rgba(0, 0, 0, .2); */
	}
	
	
	.vue-switcher-theme--custom.vue-switcher-color--dark div:after {
		background-color: #ffffff; 
		/* box-shadow: 2px 2px 5px rgba(0, 0, 0, .2); */
	}

	.vue-switcher-theme--custom.vue-switcher-color--dark.vue-switcher--unchecked div {
		background-color: #cecece; 
		/* box-shadow: 2px 2px 5px rgba(0, 0, 0, .2); */
	}
  
	.vue-switcher-theme--custom.vue-switcher-color--dark.vue-switcher--unchecked div:after {
		background-color: #ffffff; 
	}

	html {
		--text-color-normal: #2c3e50;
		--text-color-light: #8cabd9;
	}

	html[data-theme='dark'] {
		--text-color-normal: #74a2cf;
		--text-color-light: hsl(210, 15%, 35%);
		--text-color-richer: hsl(210, 50%, 72%);
		--text-color-highlight: hsl(25, 70%, 45%);
	}

		/* 
	html[theme='dark-mode'] img,
	picture,
	video{
		filter: invert(1) hue-rotate(180deg);
	} */
	
	:root {
		--bg: #fff;
		--color: #333333;
	}

	html.dark-mode {
		--bg: #232b32;
		--color: #ddd8ca;
	}

	body {
		background-color: var(--bg);
		color: var(--color);
	}

	#app {
		/* filter: invert(1) hue-rotate(180deg); */
		/* background-color: #fff; */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: var(--text-color-normal);
		max-width: 960px;
		min-width: 335px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
		/* font-size: .9rem; */

	}


	* {
		/* border: .1px solid red; */
		font-family:  "JetBrains Mono", "overpass-mono", "Cascadia Mono", "Lucida Console", monospace;
		font-weight: 500;
		box-sizing: border-box;
		transition: all 0.3s;
		outline: none;
	}

	hr {
		width: 90%;
		border: none;
		border-radius: 8px;
		margin-top: 1rem;
		border-bottom: 10px solid #dddddd;
	}

	button {
		/* min-width: 3rem;
		height: 3rem; */
		border: 2px solid;
		margin-left: 0.75rem;
		border-radius: 10px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
	}

	input,
	select {
		padding: 0.75em 0.25em;
		font-size: 1rem;
		font-size: 100%;
		border: 2px solid #c5c5c5;
		text-align: center;
		border-radius: 10px;
		cursor: pointer;
	}

	select {
		height: 2.5em;
	}

	input:focus,
	select:focus,
	button:focus {
		outline: none;
	}

	.all-toasts {
        width: 65%;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none; 
		user-select: none; 
    }

	.header {
		width: 100%;
		margin: 2rem auto 1rem auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.header * {
		font-weight: 600;
	}

	.header h2 {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: xx-large;
	}

	.header h2 span {
        vertical-align: sub;
		font-size: medium;
		align-self: flex-end;
		color: #6c8eaf;
	}

	.header h2:last-of-type {
		color: #aaa;
	}

	.header h2 img {
		width: 2.25rem;
		background-color: #aaa;
		margin: 0 0.5rem;
		border-radius: 5px;
		/* padding: .2rem; */
	}

	.list {
		width: 100%;
		margin: 0 auto;
		border-radius: 15px 15px 7.5px 15px;
		/* border-radius: 15px; */
		border: 3px solid #2c3e50;
	}

	.empty {
		padding: 1.5rem;
		padding-bottom: 2rem;
		border: none;
	}

	.empty h2 {
		color: #aaa;
	}

	.list > button:first-of-type {
		width: 90%;
		min-width: 3rem;
		height: 3rem;
		font-size: 1.1rem;
		border-radius: 10px;
		padding: 0.5rem 1rem;
		margin: 1rem auto 0.5rem auto;
		color: #ffffff;
		background-color: #2c3e50;
		border-color: #2c3e50;
	}

	.list > button:first-of-type:hover {
		color: #2c3e50;
		background-color: #ffffff;
	}

	.deadline,
	.add-deadline {
		width: 90%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.deadline {
		margin: 0 auto;
		padding: 1.5rem 0rem;
		border-bottom: 2px solid #c5c5c5;
	}

	.first {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: left;
		padding: 0.25rem 0;
	}

	.second {
		display: flex;
		justify-content: space-between;
		border-radius: 10px;
		padding: 0;
	}

	.second * {
		border-radius: 10px;
	}

	.deadline .first {
		overflow: hidden;
	}
	.deadline .first.overdue {
		color: #e63946;
	}

	.deadline .first span:last-of-type {
		font-size: 0.85rem;
		color: #aaa;
	}

	.deadline .second button {
		min-width: 3rem;
		height: 3rem;
		border-color: #fa5252;
		background-color: #fff;
	}

	.deadline .first .deadline-details {
		min-height: 2.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
	}

	.deadline .first .color-code{
		width: 5px;
		height: 2.5rem;
		display: inline-block;
		border-radius: 2.5px;
		margin-right: .75rem;
	}

	.deadline .first .deadline-details .truncate-text {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		min-width: 160px;
		width: 85%;
	}

	.add-deadline {
		margin: 1rem auto 0rem auto;
		box-sizing: border-box;
		flex-direction: column;
		padding: 0.75rem 0rem;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.add-deadline .first,
	.add-deadline .second {
		width: 100%;
		height: 3rem;
		padding: 0.25rem 0rem;
		margin-bottom: 0.75rem;
	}

	.add-deadline .second {
		align-items: flex-start;
	}

	.add-deadline .second > div:last-of-type span {
		color: #fff;
		font-size: 1rem;
		display: none;
	}

	.add-deadline .first {
		margin-bottom: 1rem;
	}

	.add-deadline .first input {
		width: 100%;
		border-radius: 10px;
		text-align: left;
		padding: 0.75rem 1rem;
	}

	.add-deadline .second > div:first-of-type {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.add-deadline .second > div:first-of-type > * {
		margin-right: .15rem;
		/* border: 1px solid red; */
	}

	.add-deadline .second > div:first-of-type > button {
		min-width: 3rem;
		height: 3rem;
		border: 2px solid #c5c5c5;
		background-color: #fff;
		padding-top: .15rem;
		text-align: center;
		cursor: default;
	}
	
	.add-deadline .second > div:last-of-type > div {
		float: left;
		min-width: 3rem;
		height: 3rem;
	}

	.add-deadline .second > div:last-of-type > div > button {
		min-width: 3rem;
		height: 3rem;
	}

	.add-deadline .second > div:last-of-type > div:first-of-type > button {
		border-color: #40c057;
		background-color: #40c057;
	}

	.add-deadline .second > div:last-of-type > div:last-of-type > button {
		border-color: #fa5252;
		background-color: #fa5252;
	}


	.options {
		border-radius: 15px;
		border-radius: 7.5px 7.5px 15px 15px;
		margin: .5rem 0;
		border: 3px solid #2c3e50;
		overflow: hidden;
		transition: all 0.1s linear;
		box-sizing: content-box;
		height: auto;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.options-collapsed {
		width: 3rem;
		max-height: 3rem;
		padding: 0;
	}

	.options-collapsed > button:first-of-type > span {
		display: none;
	}

	.options-expanded {
		width: 15rem;
		max-height: min-content;
		padding: 0 1rem .5rem 1rem;
	}

	.options-expanded > button > span {
		display: inline;
	}

	.options-expanded .toggle-options img {
		margin-left: .75rem;
	}

	.options button {
		width: 100%;
		height: 3rem;
		padding: 0.5rem 1rem;
		margin: 0 0 .5rem 0;
		border-radius: 10px;
		overflow: hidden;
		background-color: #fff;
		border: 2px solid;
	}

	.options button label {
		position: relative;
		width: 100%;
		height: 3rem;
		overflow: hidden;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.options button label input {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		z-index: -1;
		opacity: 0;
	}

	.options .theme-toggle,
	.options .toast-toggle {
		width: 100%;
		height: 3.25rem;
		padding: 0.5rem 1rem;
		margin: 0 0 .5rem 0;
		border-radius: 10px;
		overflow: hidden;
		background-color: #f5f5f5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.options .toast-toggle {
		margin: 0;
		border-radius: 10px 10px 0 0;
	}

	.options .theme-toggle {
		border-radius: 0 0 10px 10px;
	}

	.options .toggle-options {
		/* width: 3rem; */
		color: #2c3e50;
		border: none;
		font-size: 1.1rem;
		border-radius: 7.5px 7.5px 15px 15px;
	}

	.options .toggle-options span {
		font-weight: 600;
	}

	.options .export-data,
	.options .import-data,
	.options .purge-data {
		font-size: .9rem;
	}

	.options .export-data,
	.options .import-data {
		color: #2c3e50;
		border-color: #2c3e50;
	}

	.options .import-data {
		padding: 0;
	}

	.options .purge-data {
		min-width: 3rem;
		height: 3rem;
		color: #ffffff;
		border-color: #fa5252;
		background-color: #fa5252;
		box-shadow: none !important;
	}

	.invisible {
		display: none;
	}

	.last-deadline {
		border: none;
	}

	@media only screen and (max-width: 1024px) {
		#app {
			padding: 0 1rem;
		}
	}

	@media only screen and (max-width: 640px) {
		.header h2 {
			font-size: x-large;
		}

		.deadline {
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
		}

		.deadline .first {
			justify-content: flex-start;
			margin-bottom: .5rem;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			min-width: 160px;
			width: 100%;
		}
		
		.deadline .second {
			width: 100%;
		}
	}


	@media only screen and (max-width: 540px) {
		.add-deadline {
			padding: .5rem 0 .25rem 0;
		}

		.add-deadline .second {
			flex-direction: column;
			height: auto;
			align-items: center;
			padding: 0;
			margin-bottom: 0;
		}

		.add-deadline .second > div:first-of-type {
			margin-bottom: .75rem;
		}

		.add-deadline .second > div:first-of-type > * {
			margin: 0;
		}

		.add-deadline .second > div:first-of-type input:first-of-type {
			width: 90%;
		}

		.add-deadline .second > * {
			width: 100%;
		}

		.add-deadline .second > div:last-of-type {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.add-deadline .second > div:last-of-type > div {
			width: 45%;
			margin: 0;
		}

		.add-deadline .second > div:last-of-type > div > button {
			width: 100%;
			margin: 0;
		}

		.add-deadline .second > div:last-of-type > div img {
			display: none;
		}

		.add-deadline .second > div:last-of-type > div span {
			display: inline-block;
		}
	}

	@media only screen and (max-width: 512px) {
		.header {
			flex-direction: column;
			align-items:flex-start;
		}

		.header * {
			margin: .25rem 0;
		}

		.header h2:last-of-type {
			font-size: large;
		}

	}

	@media only screen and (max-width: 480px) {
		#app {
			padding: 0 .5rem;
		}

		.list {
			border-bottom-left-radius: 7.5px;
		}

		
		.deadline .second input:first-of-type {
			width: 80%;
		}

		.options-expanded {
			width: 100%;
			box-sizing: border-box;
		}
	}

	@media only screen and (max-width: 360px) {
		#app {
			padding: 0 .25rem;
		}
	}

</style>
