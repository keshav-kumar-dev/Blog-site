const jwt = require('jsonwebtoken');

const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new Error('User not registered');
  }

  const decodeData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decodeData.id });

  req.user = user;
  next();
};

module.exports = authMiddleware;
