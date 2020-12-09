const tasks = [
	"Add a new deadline using the above button.",
	"Update the date of each deadline or delete it using the button next to it.",
	"Change preferences using the dropdown located at the bottom right.",
	"Import from or export to a JSON file using the options from the dropdown.",
	"You can also purge your local data from the dropdown.",
];

const colors = ["#1abc9c", "#3498db", "#f1c40f", "#f39c12", "#2c3e50"];

const date = new Date();

let idCount = 1;

const onboardingData = tasks.map((task) => {
	let d = {};
	d.id = `demo-${idCount}`;
	d.task = task;
	d.date = date.toISOString();
	d.overdue = false;
	d.color = colors.pop();
	idCount++;
	return d;
});

export { onboardingData };
