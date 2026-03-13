const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({ 'any.required': 'Email is required' }),
    name: Joi.string().trim().min(3).required().messages({ 'any.required': 'Name is required' }),
    password: Joi.string()
      .required()
      .custom(password)
      .messages({ 'any.required': 'Password is required' }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().required().messages({ 'any.required': 'Email is required' }),
    password: Joi.string().required().messages({ 'any.required': 'Password is required' }),
  }),
};

module.exports = {
  register,
  login,
};
