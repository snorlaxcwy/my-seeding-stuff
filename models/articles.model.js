const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id=$1;`,
      [article_id]
    )
    .then(({ rows }) => {
      //grab the first row of selected data
      const article = rows[0];
      // if invalid path but no data exist like id=9999, return 404
      if (!article) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return article;
    });
};
