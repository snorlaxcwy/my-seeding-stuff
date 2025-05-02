const express = require("express");
const apiRouter = express.Router(); //main-router

const { getApi } = require("../controllers/api.controller");
const { getTopics } = require("../controllers/topics.controller");
//import subrouters
const userRouter = require("./users-router"); //subrouter
const articlesRouter = require("./articles-router"); //subrouter
const commentsRouter = require("./comments-router"); //subrouter

apiRouter.get("/", getApi);
apiRouter.get("/topics", getTopics);

// Mount subrouters
apiRouter.use("/users", userRouter); //subrouter
apiRouter.use("/articles", articlesRouter); //subrouter
apiRouter.use("/", commentsRouter); //subrouter

module.exports = apiRouter;
