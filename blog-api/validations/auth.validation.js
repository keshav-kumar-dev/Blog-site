const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().trim().required(),
    name: Joi.string().trim().min(3).required(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
};
