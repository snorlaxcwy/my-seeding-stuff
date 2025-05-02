const userRouter = require("express").Router();
const { getAllUsers } = require("../controllers/users.controller");

userRouter.get("/", getAllUsers);

module.exports = userRouter;
