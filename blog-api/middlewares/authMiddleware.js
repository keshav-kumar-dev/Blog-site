const jwt = require('jsonwebtoken');
const { status } = require('http-status');
const CustomError = require('../utils/CustomError');

const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new CustomError('User not registered', status.UNAUTHORIZED);
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decodeData.id });

  if (!user) {
    throw new CustomError('User not found', status.NOT_FOUND);
  }

  req.user = user;
  next();
};

module.exports = authMiddleware;
