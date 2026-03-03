const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();
const User = require('../models/User');

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      if (req && req.cookies) {
        return req.cookies.token;
      }
      return null;
    },
  ]),
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = { jwtStrategy };
