const { status } = require('http-status');
const { userService, authService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const config = require('../config/config');

// Updated sendToken function with CustomError logic
const sendToken = async (user, res) => {
  const token = await user.signJWT();
  if (!token) {
    // Use CustomError to throw error when token generation fails
    throw new CustomError(
      'Something went wrong while generating the token',
      status.INTERNAL_SERVER_ERROR
    );
  }

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure this is true in production
    sameSite: 'Strict',
    maxAge: config.tokenExpiration,
  });
  return token;
};

// Updated register function with CustomError logic
const register = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);

  if (!user) {
    // Use CustomError to handle case when user creation fails
    return next(new CustomError('User creation failed', status.BAD_REQUEST));
  }

  const tokens = await sendToken(user, res);
  res.status(status.CREATED).send({ data: user, tokens });
});

// Updated login function with CustomError logic
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (!user) {
    // Use CustomError if the login fails (e.g., wrong email or password)
    return next(new CustomError('Invalid email or password', status.UNAUTHORIZED));
  }

  await sendToken(user, res);
  res.status(status.OK).json({ data: user });
});

// Updated logout function with CustomError logic
const logout = catchAsync(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.status(status.OK).json({ message: 'Logout successful' });
});

// Updated profile function with CustomError logic
const profile = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    // Use CustomError when the user is not found in the request (unauthorized access)
    return next(new CustomError('User not found', status.NOT_FOUND));
  }

  res.status(status.OK).json({ message: 'User Profile', data: user });
});

module.exports = { register, login, logout, profile };
