const { resource } = require("../app");
const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.selectCommentsByArticleId = (article_id) => {
  const queryStr = `SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id=$1
    ORDER BY created_at DESC;`;

  //double check if article exists
  return db.query(queryStr, [article_id]).then((result) => {
    //if articles table doesnt have this article_id, result.rows will be empty
    if (result.rows.length === 0) {
      return db
        .query(
          // check if articles has this article
          `SELECT * FROM articles WHERE article_id = $1`,
          [article_id]
        )
        .then((articleResult) => {
          if (articleResult.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "404 Not Found" });
          } else {
            return []; //test 5c
          }
        });
    } else {
      return result.rows;
    }
  });
};
