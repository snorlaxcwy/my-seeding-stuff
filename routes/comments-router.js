const commentsRouter = require("express").Router();

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  removeComment,
} = require("../controllers/comments.controller");

commentsRouter.get("/articles/:article_id/comments", getCommentsByArticleId);

commentsRouter.post("/articles/:article_id/comments", postCommentByArticleId);

commentsRouter.delete("/comments/:comment_id", removeComment);

module.exports = commentsRouter;
