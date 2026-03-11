const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');

const db = catchAsync(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database connected');
  } catch (err) {
    console.log('Database connection failed');

    throw new CustomError('Database connection failed: ' + err.message, 500);
  }
});

module.exports = db;
