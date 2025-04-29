//setup express server
const express = require("express");
const app = express();

//middleware
app.use(express.json());

//routes
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

// 404 handler
app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "404 Not Found" });
});

// erroe handlers
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "400 Bad Request" });
  } else if (err.status) {
    return res.status(err.status).send({ msg: err.msg });
  } else {
    return res.status(500).send({ msg: "500 Internal Server Error" });
  }
});

module.exports = app;
