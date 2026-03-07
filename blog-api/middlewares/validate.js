const Joi = require('joi');
const pick = require('../utils/pick');
const httpStatus = require('http-status');
const CustomError = require('../utils/CustomError');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');

    throw new CustomError(errorMessage, httpStatus.BAD_REQUEST);
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
