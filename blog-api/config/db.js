const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

const db = catchAsync(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database connected');
  } catch (err) {
    console.log('Database connection failed');

    throw new Error('Database connection failed: ' + err.message);
  }
});

module.exports = db;
