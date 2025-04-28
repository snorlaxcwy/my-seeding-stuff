//setup express server
const express = require("express");
const app = express();

const endpoints = require("./endpoints.json");

//middleware
app.use(express.json());

//routes
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

// 404 handler
app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "404 Not Found" });
});

// erroe handlers
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  } else if (err.status) {
    return res.status.send({ msg: "err.msg" });
  } else {
    return res.status(500).send({ msg: "500 Internal Server Error" });
  }
});

module.exports = app;
