const userService = require('./user.service');
const { status } = require('http-status');
const CustomError = require('../utils/CustomError');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new CustomError('Incorrect email or password', status.BAD_REQUEST);
  }
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
