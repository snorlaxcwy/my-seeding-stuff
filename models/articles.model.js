const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");
const comments = require("../db/data/test-data/comments");
//Task 3 & 12
exports.selectArticleById = (article_id) => {
  // check if article_id is number or not
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }
  return db
    .query(
      `SELECT articles.*,
       COUNT(comments.comment_id)::INT AS comment_count
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id=$1 
      GROUP BY articles.article_id;`,
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

/**
 * selectAllArticles - Main function for fetching articles with:
 *  - Sorting, Filtering, Pagination, and Total Count
 *  - Handles all error cases according to test suite
 *
 * Tasks:
 *   - Task 4: 基本列出所有 articles
 *   - Task 10: 支援 sort_by 及 order
 *   - Task 11: 用 topic filter，並正確處理不存在嘅 topic
 *   - Task 19: 支援 pagination (limit, p) 及 total_count
 */
exports.selectAllArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1
) => {
  // --- 1. Validate sort and order parameters (Task 10) ---
  const validSortColumns = [
    "title",
    "topic",
    "body",
    "author",
    "created_at",
    "votes",
    "article_id",
    "comment_count",
  ];
  const validOrders = ["asc", "desc"];
  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "400 Invalid sort_by query" });
  }
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "400 Invalid order query" });
  }

  // --- 2. Validate pagination inputs (Task 19) ---
  // limit
  if (limit !== undefined && (isNaN(limit) || limit < 1)) {
    return Promise.reject({ status: 400, msg: "Invalid limit query" });
  }
  // page
  if (p !== undefined && (isNaN(p) || p < 1)) {
    return Promise.reject({ status: 400, msg: "Invalid page query" });
  }
  limit = Number(limit) || 10;
  p = Number(p) || 1;
  const offset = (p - 1) * limit;

  // --- 3. Prepare SQL query (Task 4, 10, 11, 19) ---
  const queryValues = [];
  let whereStr = "";
  if (topic) {
    whereStr = "WHERE articles.topic = $1";
    queryValues.push(topic);
  }

  // --- 4. Articles query with pagination ---
  const articleQuery = `
    SELECT articles.article_id, articles.title, articles.topic, articles.body, articles.author,
      articles.created_at, articles.votes, articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    ${whereStr}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2};
  `;
  // --- 5. Query for total_count (filters applied) ---
  const countQuery = `
    SELECT COUNT(*)::INT AS total_count FROM articles ${whereStr};
  `;

  // --- 6. Run queries in parallel ---
  const [articlesResult, countResult] = await Promise.all([
    db.query(articleQuery, [...queryValues, limit, offset]),
    db.query(countQuery, queryValues),
  ]);

  // --- 7. Handle case: topic exists but no articles (Task 11c/11d) ---
  if (articlesResult.rows.length === 0 && topic) {
    const topicCheck = await db.query(`SELECT * FROM topics WHERE slug = $1`, [
      topic,
    ]);
    if (topicCheck.rows.length === 0) {
      // topic does not exist (Task 11d)
      return Promise.reject({ status: 404, msg: "404 Not Found" });
    } else {
      // topic exists, but no articles (Task 11c)
      return { articles: [], total_count: 0 };
    }
  }

  // --- 8. Return results (Task 4, 19) ---
  return {
    articles: articlesResult.rows,
    total_count: countResult.rows[0].total_count,
  };
};

//Task 7
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

//Task 18
exports.insertArticle = (articleData) => {
  //explain the data inside articleData
  const { title, topic, author, body, article_img_url } = articleData;
  if (!title || !topic || !author || !body) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }
  // execute insert
  const queryStr = `
    INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES($1,$2,$3,$4,$5)
    RETURNING *`;
  const values = [title, topic, author, body, article_img_url || null];

  return db.query(queryStr, values).then(({ rows }) => rows[0]);
};

// Task 22
exports.deleteArticleById = async (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "400 Bad Request" });
  }

  const articleRes = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (articleRes.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "404 Not Found" });
  }

  await db.query(`DELETE FROM comments WHERE article_id = $1`, [article_id]);

  await db.query(`DELETE FROM articles WHERE article_id = $1`, [article_id]);
};
