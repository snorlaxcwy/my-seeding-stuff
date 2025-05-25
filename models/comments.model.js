const { resource } = require("../app");
const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

//Task 5 & 20
exports.selectCommentsByArticleId = async (article_id, limit, p) => {
  limit = Number(limit) || 10;
  p = Number(p) || 1;
  if (isNaN(limit) || limit < 1)
    throw { status: 400, msg: "Invalid limit query" };
  if (isNaN(p) || p < 1) throw { status: 400, msg: "Invalid page query" };
  const offset = (p - 1) * limit;

  const queryStr = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id=$1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;`;

  const countStr = `SELECT COUNT(*)::INT AS total_count FROM comments WHERE article_id=$1;`;

  const [result, countResult] = await Promise.all([
    db.query(queryStr, [article_id, limit, offset]),
    db.query(countStr, [article_id]),
  ]);
  //double check if article exists
  if (result.rows.length === 0) {
    const article = await db.query(
      `SELECT * FROM articles WHERE article_id=$1`,
      [article_id]
    );
    if (article.rows.length === 0) throw { status: 404, msg: "404 Not Found" };
  }
  return {
    comments: result.rows,
    total_count: countResult.rows[0].total_count,
  };
};

//Task 6
exports.insertCommentByArticleId = (article_id, newComment) => {
  const { username, body } = newComment;
  // if no username/body => pass to 400
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }
  // check article_id exists or not
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      //if article_id not exists, pass to 404
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      //insert comment
      const queryStr = `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`;

      return db
        .query(queryStr, [username, body, article_id])
        .then(({ rows }) => rows[0]);
    });
};

//Task 8
exports.deleteCommentByCommentId = (comment_id) => {
  //if comment_id is invalid - test 8b
  if (isNaN(Number(comment_id))) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }
  return (
    db
      .query(
        `DELETE FROM comments WHERE comment_id=$1
    RETURNING *;`,
        [comment_id]
      )
      //if comment_id is valid but not data exist - test 8c
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "404 Not Found" });
        }
      })
  );
};

// Task 17
exports.updateCommentVotes = (comment_id, inc_votes) => {
  if (isNaN(Number(comment_id))) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }
  if (inc_votes === undefined || typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return rows[0];
    });
};
