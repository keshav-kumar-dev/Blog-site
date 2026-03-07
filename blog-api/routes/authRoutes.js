const express = require('express');
const validate = require('../middlewares/validate');

const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/authController');

const passport = require('passport');

const authRouter = express.Router();

authRouter.post('/register', validate(authValidation.register), authController.register);
authRouter.post('/login', validate(authValidation.login), authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  authController.profile
);

module.exports = authRouter;
