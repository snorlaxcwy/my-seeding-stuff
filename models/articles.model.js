const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

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

exports.selectAllArticles = async () => {
  const queryStr = `SELECT articles.author, articles.title, articles.article_id,articles.topic, 
  articles.created_at, 
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  const result = await db.query(queryStr);
  return result.rows;
};

exports.updateVotesByArticleId = (article_id, inc_votes) => {
  //if inc_votes is empty
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }

  //check article_is exists
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      //update votes in the article object
      return db.query(
        `UPDATE articles
      SET votes = votes + $1
      WHERE article_id= $2
      RETURNING *;`,
        [inc_votes, article_id]
      );
    })
    .then(({ rows }) => rows[0]);
};
