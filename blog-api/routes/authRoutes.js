const express = require('express');
const validate = require('../middlewares/validate');

const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/authController');
// const authMiddleware = require('../middlewares/authMiddleware');
const passport = require('passport');

const authRouter = express.Router();

authRouter.post('/register', validate(authValidation.register), authController.register);
authRouter.post('/login', validate(authValidation.login), authController.login);
authRouter.post(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  authController.profile
);
// authRouter.post('/profile', authMiddleware, authController.profile);

module.exports = authRouter;
