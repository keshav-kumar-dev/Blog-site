const User = require('../models/User');
const httpStatus = require('http-status');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new Error('Email already taken');
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
