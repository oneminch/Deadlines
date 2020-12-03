import nid from "nid";

const tasks = [
	"Add a new deadline using the above button.",
	"Update the date of each deadline or delete it using the buttons to the right.",
	"Change preferences using the dropdown located at the bottom right.",
	"Import from or export to a JSON file using the options from the dropdown.",
	"You can also purge your local data from the dropdown.",
];

const colors = ["#1abc9c", "#3498db", "#f1c40f", "#f39c12", "#2c3e50"];

const date = new Date();
date.setDate(date.getDate() + 1);

const data = tasks.map((task) => {
	let d = {};
	d.id = nid();
	d.task = task;
	d.date = date.toISOString();
	d.overdue = false;
	d.color = colors.pop();
	return d;
});

export { data };
