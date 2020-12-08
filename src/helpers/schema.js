import Schema from "validate";

const hexColor = (val) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);

export const schema = new Schema(
	{
		task: {
			type: String,
			required: true,
			length: { min: 1, max: 100 },
		},
		date: {
			type: Date,
			required: true,
		},
		overdue: {
			type: Boolean,
			required: true,
		},
		color: {
			type: String,
			required: true,
			use: { hexColor },
		},
		id: {
			type: String,
			required: true,
		},
	},
	{ typecast: true }
);
