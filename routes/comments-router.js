const commentsRouter = require("express").Router();

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  removeComment,
  patchCommentVotes,
} = require("../controllers/comments.controller");

commentsRouter.get("/articles/:article_id/comments", getCommentsByArticleId);

commentsRouter.post("/articles/:article_id/comments", postCommentByArticleId);

commentsRouter.patch("/comments/:comment_id", patchCommentVotes);

commentsRouter.delete("/comments/:comment_id", removeComment);

module.exports = commentsRouter;
