const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  patchArticleVotes,
  postArticle,
} = require("../controllers/articles.controller");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/", getAllArticles);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.post("/", postArticle);

module.exports = articlesRouter;
