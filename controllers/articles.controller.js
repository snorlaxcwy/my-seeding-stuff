const {
  selectArticleById,
  selectAllArticles,
  updateVotesByArticleId,
} = require("../models/articles.model");
//Task 3 & 12
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
//Task 4 ,10 & 11
exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log("ERROR:", err);
      next(err);
    });
};
//Task 7
exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateVotesByArticleId(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
