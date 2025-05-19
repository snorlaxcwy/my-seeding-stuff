//setup express server
const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const cors = require("cors");

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api", apiRouter);

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
