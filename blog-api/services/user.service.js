const User = require('../models/User');
const { status } = require('http-status');
const CustomError = require('../utils/CustomError');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new CustomError('Email already taken', status.BAD_REQUEST);
  }
  return User.create(userBody);
};

//  Get user by id
const getUserById = async (id) => {
  return User.findById(id);
};

//  Get user by email
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
