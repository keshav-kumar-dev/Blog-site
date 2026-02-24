const {register,login,profile} = require("../controllers/authController");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/profile",authMiddleware,profile);

module.exports = authRouter;