<template>
	<div id="app">
		<!-- Overlay - About Project -->
		<div :class="[
			'about-overlay',
			{ invisible: !overlay }
			]"
			@click="hideOverlay"
		>
			<div class="about-info">
				<img src="./assets/logo.png" alt="Logo" />
				<p>
					Deadlines is a simple, offline deadline tracker made with Vue.js and localForage.
					<br><br>
					All data is stored locally in the browser 🔐.
					You can import/export deadlines from/to a JSON file. It also has dark mode 🌓.
					<br><br>
					If you want to view this overlay again, you can do so by clicking on or tapping the <i class="gg-info"></i> icon at the top of the page.

				</p>
				<div>
					<a href="https://github.com/oneminch/deadlines" target="_blank" rel="noopener">
						<span>GitHub</span>
						<i class="gg-link"></i>
					</a>
					<button @click="hideOverlay">
						<span>Continue to app</span>
						<i class="gg-arrow-right-o"></i>
					</button>
				</div>
				<a href="https://www.producthunt.com/posts/deadlines-950fa45d-e41f-417f-a661-7a26f861c4b2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-deadlines-950fa45d-e41f-417f-a661-7a26f861c4b2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=278969&theme=dark" alt="Deadlines - A simple, offline deadline tracker | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
			</div>
		</div>

		<!-- Header - App Name, Logo and Today's Date -->
		<div class="header">
			<h2 @click="overlay = true">
				<span>Deadlines</span>
				<i class="gg-info"></i>
			</h2>
			<h2>{{ displayToday() }}</h2>
		</div>
	
		<div class="list" @click="collapseOptions">
			<!-- Add Deadline Button and Input -->
			<button v-if="!visibleInput" @click="visibleInput = true; expandedOptions = false;">
				Add New Deadline
			</button>
			<div v-else class="add-deadline">
				<div class="first">
					<input ref="input" type="text" placeholder="Enter deadline..." maxlength="100" autofocus/>
				</div>
				<div class="second">
					<div>
						<datepicker
							:format="format"
							:value="currDate"
							@selected="newDate"
							calendar-class="calendar-class"
							input-class="input-class"
							content="Pick date"
							v-tippy
						></datepicker>
						<button content="Pick color" title="Pick color">
							<v-swatches 
								v-model="currColor" 
								show-fallback 
								:swatch-size="35" 
								:trigger-style="swatchCSS.trigger"
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

			<!-- Deadlines List Rendered from Database -->
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
						input-class="input-class"
						calendar-class="calendar-class"
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

			<!-- An Empty Deadlines List -->
			<div :class="['empty', 'list', { invisible: !isListEmpty }]">
				<h2>You have no deadlines...🌴</h2>
			</div>
		</div>

		<!-- List of Preferences & Tools -->
		<div class="options" :class="{ 'options-expanded' : expandedOptions, 'options-collapsed' : !expandedOptions }">
			<button class="toggle-options" @click="expandedOptions = !expandedOptions; ">
				<span>Options</span>
				<svg 
					v-if="!expandedOptions"
					xmlns="http://www.w3.org/2000/svg" 
					viewBox="0 0 25 25"
				>
					<polyline points="6 9 12 15 18 9"/>
				</svg>
				<svg 
					v-else
					xmlns="http://www.w3.org/2000/svg" 
					viewBox="0 0 25 25"
				>
					<polyline points="18 15 12 9 6 15"/>
				</svg>
			</button>
			<div class="toast-toggle">
				<span>Toasts</span>
				<VueToggles
					@click="options.toastEnabled = !options.toastEnabled; notify = true"
					:value="options.toastEnabled"
					height="30"
					width="50"
					:checkedBg="toggleColors.checked"
					:uncheckedBg="toggleColors.unchecked"
				/>
			</div>
			<div class="theme-toggle">
				<span>Dark Mode</span>
				<VueToggles
					@click="options.darkThemeEnabled = !options.darkThemeEnabled; notify = true"
					:value="options.darkThemeEnabled"
					height="30"
					width="50"
					:checkedBg="toggleColors.checked"
					:uncheckedBg="toggleColors.unchecked"
				/>
			</div>
			<hr>			
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
	import { onboardingData } from "./helpers/onboardingData"
	import { deadlines_db, options_db } from "./helpers/localdb";

	export default {
		name: "App",
		data() {
			return {
				currID: -1,
				currDate: this.offsetedToday(),
				currIndex: -1,
				currColor: "#f1c40f",
				overlay: false,
				visibleInput: false,
				expandedOptions: false,
				format: "MMM dd, yyyy",
				idList: [],
				deadlines: [],
				options: {
					firstTime: true,
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
					"#ffffff",
					"#ecf0f1",
					"#bdc3c7",
					"#171a1d"
				],
				toggleColors: {
					checked: '#40c057',
					unchecked: '#ced4da'
				},
				swatchCSS: {
					trigger: {
						width: '30px',
						height: '30px',
						margin: '0 auto',
						border: '1px solid #a1adb9'
					}
				},
				purgeConfirmMessages: [
					'Purge Database',
					'Are you sure?',
					'Done!'
				],
				width: window.innerWidth,
				notify: false // used for toastifications
			};
		},
		methods: {
			// hide 'about project' overlay
			hideOverlay: function() {
				this.overlay = false;

				// if it's user's first time, save preferences
				if (this.options.firstTime) {
					this.options.firstTime = false;
				}
			},
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
				let vm = this, demoData = [];

				options_db
					.getItem("options")
					.then(function(db) {
						// offline store for options doesn't exist; initialize
						if (db === null) {
							options_db
								.setItem("options", vm.options)
								.then((value) => {
									vm.populateOptions(value);
									vm.overlay = vm.options.firstTime;
								})
								.catch((err) => {
									// error setting up db
									vm.$toast.error("Error setting up local database for preferences.");
									throw err;
								});
						} else {
							vm.notify = false;
							vm.populateOptions(db);
						}
					})
					.catch(function(err) {
						// if there are any errors
						vm.$toast.error("Error setting up local database.");
						throw err;
					});

				deadlines_db
					.getItem("deadlines")
					.then(function(db) {
						// offline store for deadlines doesn't exist; initialize
						if (db === null) {
							console.log('repopulating...');
							
							// update date of each demo deadline to the following day
							demoData = [...onboardingData];
							demoData.forEach(el => {
								const tomorrow = (d => new Date(d.setDate(d.getDate() + 1)))(new Date);
								el.date = vm.offsetDate(tomorrow);
							});

							deadlines_db
								.setItem("deadlines", demoData)
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
						// if demo (onboarding) data, reset dates
						if (data[i].id.startsWith("demo-")) {
							const tomorrow = (d => new Date(d.setDate(d.getDate() + 1)))(new Date);
							data[i].date = this.offsetDate(tomorrow);
						}

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

				this.options.firstTime = data.firstTime;
				this.options.toastEnabled = data.toastEnabled;
				this.options.darkThemeEnabled = data.darkThemeEnabled;
			},
			// Purges offline database and updates array
			purgeDatabase: function() {
				let vm = this;

				deadlines_db
					.setItem("deadlines", [])
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
							// offset the hours of imported deadline dates
							validatedContents.forEach(el => {
								el.date = vm.offsetDate(el.date);
							});

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
				handler: function() {
					// toggle dark mode
					let rootElt = document.querySelector('html');

					if (this.options.darkThemeEnabled && !rootElt.hasAttribute('data-theme')) {
						rootElt.setAttribute('data-theme','dark');
						this.toggleColors.unchecked = "#576a7c"; // update color for toggles
					} else if (!this.options.darkThemeEnabled) {
						rootElt.removeAttribute('data-theme');
						this.toggleColors.unchecked = "#ced4da"; // update color for toggles
					}

					// update offline store when preferences change
					let vm = this;
					options_db
						.setItem("options", this.options)
						.then(() => {
							if (vm.options.toastEnabled && vm.notify) {
								vm.$toast.success("Preferences successfully updated.");
							}
						})
						.catch((err) => {
							vm.$toast.error("Error updating database for preferences.");
							throw err;
						});
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

	:root {
		--primary-red-color: #fa5252;
		--primary-green-color: #40c057;
		--overdue-red-color: #e63946;
		--gray-text-color: #748ca3;
	}

	html {
		--text-color: #2c3e50;
		--background-color: #ffffff;
		--gray-border-color: #ced4da;
		--wrapper-border-color: #2c3e50;
		--add-button-background-color: #2c3e50;
		--opt-button-background-color: #ffffff;
		--opt-toggle-background-color: #e9ecef;
	}

	html[data-theme='dark'] {
		--text-color: #ffffff;
		--background-color: #171a1d;
		--gray-border-color: #3e4a57;
		--wrapper-border-color: #3e4a57;
		--add-button-background-color: #3e4a57;
		--opt-button-background-color: #3e4a57;
		--opt-toggle-background-color: #3e4a57;
	}

	html,
	body  {
		background-color: var(--background-color);
		color: var(--text-color);
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		max-width: 960px;
		min-width: 335px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}

	* {
		font-family:  "JetBrains Mono", "overpass-mono", "Cascadia Mono", "Lucida Console", monospace;
		font-weight: 500;
		box-sizing: border-box;
		outline: none;
		transition: all 0.3s, color 0s, background-color 0s;
		-moz-transition: all 0.3s, color 0s, background-color 0s;
		-webkit-transition: all 0.3s, color 0s, background-color 0s;
	}

	hr {
		width: 90%;
		border: none;
		border-radius: 8px;
		margin-top: 1rem;
		border-bottom: 10px solid var(--gray-border-color);
	}

	button {
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
		color: var(--gray-text-color);
		background-color: var(--background-color);
		border: 3px solid var(--gray-border-color);
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


	/* classes prefixed with 'gg' are CSS icons from CSS.gg */
	.gg-info,
	.gg-link,
	.gg-arrow-right-o {
		box-sizing: border-box;
		position: relative;
		display: inline-block;
	}

	.gg-info::after,
	.gg-info::before,
	.gg-link::after,
	.gg-link::before,
	.gg-arrow-right-o::after,
	.gg-arrow-right-o::before {
		content: "";
		display: inline-block;
		box-sizing: border-box;
		position: absolute;
	}

	/* Info icon CSS from css.gg */
	.gg-info {
		width: 20px;
		height: 20px;
		border: 2px solid;
		border-radius: 40px;
		transform: scale(1.2);
		color: var(--gray-text-color);
	}

	.gg-info::after,
	.gg-info::before {
		border-radius: 3px;
		width: 2px;
		background: var(--gray-text-color);
		left: 7px;
	}

	.gg-info::after {
		bottom: 2px;
		height: 8px;
	}

	.gg-info::before {
		height: 2px;
		top: 2px;
	} 

	/* Right arrow icon CSS from css.gg */
	.gg-arrow-right-o {
		width: 22px;
		height: 22px;
		border: 2px solid;
		border-radius: 20px;
	}

	.gg-arrow-right-o::after,
	.gg-arrow-right-o::before {
		right: 4px;
	}

	.gg-arrow-right-o::after {
		width: 6px;
		height: 6px;
		border-top: 2px solid;
		border-right: 2px solid;
		transform: rotate(45deg);
		bottom: 6px;
	}

	.gg-arrow-right-o::before {
		width: 10px;
		height: 2px;
		bottom: 8px;
		background: var(--text-color);
	}

	/* Link icon CSS from css.gg */
	.gg-link {
		transform: rotate(-45deg);
		width: 8px;
		height: 2px;
		background: #ffffff;
		border-radius: 4px;
	}

	.gg-link::after,
	.gg-link::before {
		border-radius: 3px;
		width: 8px;
		height: 10px;
		border: 2px solid;
		top: -4px;
	}

	.gg-link::before {
		border-right: 0;
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
		left: -6px;
	}

	.gg-link::after {
		border-left: 0;
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
		right: -6px;
	}

	.all-toasts {
        width: 65%;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none; 
		user-select: none; 
    }

	.about-overlay {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		overflow: auto;
	}

	.about-info {
		width: 75%;
		min-width: 360px;
		max-width: 1000px;
		height: 75%;
		min-height: 640px;
		border-radius: 15px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		color: var(--text-color);
		background-color: var(--background-color);
		border: 3px solid var(--wrapper-border-color);
		overflow: auto;
	}

	.about-info > img {
		width: 4rem;
		height: 4rem;
	}

	.about-info p {
		width: 65%;
		text-align: center;
		line-height: 1.5;
	}

	.about-info p .gg-info {
		transform: scale(.9);
		color: var(--text-color);
	}

	.about-info p .gg-info::after,
	.about-info p .gg-info::before {
		background: var(--text-color);
	}

	.about-info > div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: .5rem auto;
	}

	.about-info > div > a,
	.about-info > div > button {
		display: inline-block;
		min-width: 3rem;
		height: 2.5rem;
		margin: .5rem 1rem;
		padding: 0.25rem 1rem;
		font-size: .9rem;
		border: 2px solid;
		box-sizing: border-box;
		border-radius: 10px;
	}

	.about-info > div > a {
		text-decoration: none;
		cursor: pointer;
		line-height: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-color: #24292e;
		color: #ffffff;
		background-color: #24292e;
	}

	.about-info > div > button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--text-color);
		border: 3px solid var(--wrapper-border-color);
		background-color: var(--opt-button-background-color);
	}

	.about-info > div > a > span {
		margin: 0 1rem 0 0;
	}

	.about-info > div > button > span{
		margin: 0 .5rem 0 0;
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
		cursor: pointer;
	}

	.header h2 span {
        margin-right: .75rem;
	}

	.header h2:last-of-type {
		color: var(--gray-text-color);
	}

	.list {
		width: 100%;
		margin: 0 auto;
		border-radius: 15px 15px 7.5px 15px;
		border: 3px solid var(--wrapper-border-color);
	}

	.empty {
		padding: 1.5rem;
		padding-bottom: 2rem;
		border: none;
	}

	.empty h2 {
		color: var(--gray-text-color);
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
		background-color: var(--add-button-background-color);
		border-color: var(--add-button-background-color);
	}

	.list > button:first-of-type:hover {
		color: var(--text-color);
		background-color: var(--background-color);
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
		border-bottom: 3px solid var(--gray-border-color);
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
		height: auto;
		overflow: hidden;
	}
	.deadline .first.overdue {
		color: var(--overdue-red-color);
	}

	.deadline .first span:last-of-type {
		font-size: 0.85rem;
		color: var(--gray-text-color);
	}

	.deadline .second button {
		min-width: 3rem;
		height: 3rem;
		border-color: var(--primary-red-color);
		background-color: var(--background-color);
	}

	.deadline .first .deadline-details {
		min-height: 2.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
	}

	.deadline .second input,
	.deadline .second select {
		border-width: 2px;
	}

	.deadline .first .color-code{
		min-width: 5px;
		min-height: 2.75rem;
		display: inline-block;
		border-radius: 2.5px;
		margin-right: .75rem;
	}

	.deadline .first .deadline-details .truncate-text {
		line-height: 1.5;
		min-width: 160px;
		width: 85%;
		margin-bottom: .25rem;
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
		cursor: text;
		color: var(--text-color);
	}

	.add-deadline .second > div:first-of-type {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.add-deadline .second > div:first-of-type > * {
		margin-right: .15rem;
	}

	.add-deadline .second > div:first-of-type > button {
		min-width: 3rem;
		height: 3rem;
		border: 3px solid var(--gray-border-color);
		background-color: var(--background-color);
		padding-top: .15rem;
		text-align: center;
		cursor: default;
	}
	
	/* I know about !important. Trust me it's important this time */
	.add-deadline .second > div:first-of-type > button .vue-swatches__container {
		box-shadow: none !important;
		border: 2px solid var(--gray-border-color) !important;
		background-color: var(--background-color) !important;
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
		border-color: var(--primary-green-color);
		background-color: var(--primary-green-color);
	}

	.add-deadline .second > div:last-of-type > div:last-of-type > button {
		border-color: var(--primary-red-color);
		background-color: var(--primary-red-color);
	}

	.options {
		height: auto;
		margin: .5rem 0;
		overflow: hidden;
		border-radius: 15px;
		box-sizing: content-box;
		border-radius: 7.5px 7.5px 15px 15px;
		border: 3px solid var(--wrapper-border-color);
		transition: width 0.1s, max-height 0.1s, padding 0.1s;
		-webkit-transition: width 0.1s, max-height 0.1s, padding 0.1s;
		-moz-transition: width 0.1s, max-height 0.1s, padding 0.1s;
		-o-transition: width 0.1s, max-height 0.1s, padding 0.1s;
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

	.options .toggle-options svg {
		width: 25px !important; 
		height: 25px !important;
		fill: none; 
		stroke: #ffffff;
		stroke-width: 3px;
		stroke-linecap: round;
		stroke-linejoin: round;
		box-sizing: content-box;
		stroke: var(--wrapper-border-color);
	}

	.options-collapsed .toggle-options {
		padding: 0;
	}

	.options-expanded .toggle-options {
		border-radius: 7.5px 7.5px 15px 15px;
	}

	.options-expanded .toggle-options svg {
		margin-left: .75rem;
	}

	.options button {
		width: 100%;
		height: 3rem;
		padding: 0.5rem 1rem;
		margin: 0 0 .5rem 0;
		border-radius: 10px;
		overflow: hidden;
		background-color: var(--background-color);
		color: var(--text-color);
		border: 2px solid;
	}

	.options hr {
		width: 95%;
		border: none;
		border-radius: 2px;
		margin: 1rem auto;
		border-bottom: 2px solid var(--opt-toggle-background-color);
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
		background-color: var(--opt-toggle-background-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.options .theme-toggle span:last-of-type,
	.options .toast-toggle span:last-of-type {
		background-color: #fff;
	}

	.options .toast-toggle {
		margin: 0;
		border-radius: 10px 10px 0 0;
	}

	.options .theme-toggle {
		border-radius: 0 0 10px 10px;
	}

	.options .toggle-options {
		border: none;
		font-size: 1.1rem;
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
		border-color: var(--wrapper-border-color);
		background-color: var(--opt-button-background-color);
	}

	.options .import-data {
		padding: 0;
	}

	/* I know about !important. Trust me it's important this time */
	.options .purge-data {
		min-width: 3rem;
		height: 3rem;
		color: #ffffff;
		border-color: var(--primary-red-color);
		background-color: var(--primary-red-color);
		box-shadow: none !important;
	}

	.invisible {
		display: none;
	}

	.last-deadline {
		border: none;
	}

	/* I know about !important. Trust me it's important this time */
	.calendar-class, .input-class {
		background-color: var(--background-color) !important;
		color: var(--text-color);
	}

	@media only screen and (max-height: 645px) {
		.about-overlay {
			align-items: flex-start;
		}
	}

	@media only screen and (max-width: 1024px) {
		#app {
			padding: 0 1rem;
		}
	}

	@media only screen and (max-width: 840px) {
		.about-info p {
			width: 80%;
		}
	}

	@media only screen and (max-width: 768px) {
		.about-info {
			width: 100%;
			height: 100%;
			padding: .5rem;
			border-radius: 0;
		}

		.about-info p {
			width: 85%;
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
			width: 100%;
		}

		.deadline .first .deadline-details .truncate-text {
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
		.about-info > div {
			flex-direction: column;
		}

		.about-info img {
			width: 2.5rem;
			height: 2.5rem;
		}

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
