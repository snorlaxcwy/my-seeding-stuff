const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentByCommentId,
  updateCommentVotes,
} = require("../models/comments.model");

//Task 5 & 20
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;
  selectCommentsByArticleId(article_id, limit, p)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};
//Task 6
exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  insertCommentByArticleId(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

//Task 8
exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByCommentId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

// Task 17
exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotes(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
