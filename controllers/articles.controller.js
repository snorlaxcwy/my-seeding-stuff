const {
  selectArticleById,
  selectAllArticles,
  updateVotesByArticleId,
  insertArticle,
  deleteArticleById,
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

//Task 4 ,10 ,11 & 21
exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;
  selectAllArticles(sort_by, order, topic, limit, p)
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
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

//Task 18
exports.postArticle = (req, res, next) => {
  const articleData = req.body;
  insertArticle(articleData)
    .then((newArticle) => {
      res.status(201).send({ article: newArticle });
    })
    .catch(next);
};

// task 22
exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticleById(article_id)
    .then(() => res.status(204).send())
    .catch(next);
};
