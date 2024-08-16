import Joi from "joi";

const hexColorRegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const schema = Joi.object({
  task: Joi.string().min(1).max(100).required(),
  date: Joi.date().required(),
  overdue: Joi.boolean().required(),
  color: Joi.string().pattern(hexColorRegExp).required(),
  id: Joi.string().min(1).max(100).required()
});

// schema.validate({ username: "abc", birth_year: 1994 });
// // -> { value: { username: 'abc', birth_year: 1994 } }

// schema.validate({});
// // -> { value: {}, error: '"username" is required' }

// // Also -

// try {
//   const value = await schema.validateAsync({
//     username: "abc",
//     birth_year: 1994
//   });
// } catch (err) {}
