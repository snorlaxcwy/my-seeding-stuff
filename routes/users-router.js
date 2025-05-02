const userRouter = require("express").Router();
const {
  getAllUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

userRouter.get("/", getAllUsers);
userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
