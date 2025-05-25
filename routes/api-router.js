const express = require("express");
const apiRouter = express.Router();

const { getApi } = require("../controllers/api.controller");
// import subrouters
const userRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router"); //

apiRouter.get("/", getApi);

// Mount subrouters
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/", commentsRouter);
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
