const authController = require("../controllers/authController");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/profile",authMiddleware, authController.profile);

module.exports = authRouter;