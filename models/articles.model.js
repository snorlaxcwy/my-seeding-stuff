const db = require("../db/connection");
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
//Task 4, 10 & 11
exports.selectAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  //greenlisting
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

  //Task 10 invalid sortby query
  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "400 Invalid sort_by query" });
  }
  //Task 10 invlaid order query
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "400 Invalid order query" });
  }

  //Test 11c. 200 return empty array if valid topic has no articles
  const queryValues = [];
  //use let here, becuase we will reassign queryStr later
  let queryStr = `SELECT articles.article_id,
         articles.title,
         articles.topic,
         articles.body,
         articles.author,
         articles.created_at,
         articles.votes,
         articles.article_img_url,
         COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON comments.article_id = articles.article_id `;

  //Task 11 Add Topic filter => have articles no matter with topic filter or not
  if (topic) {
    queryStr += ` WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }
  queryStr += `GROUP BY 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.body,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url
  ORDER BY ${sort_by} ${order};`;
  // console.log("SQL:", queryStr);
  // console.log("Values:", queryValues);
  return db.query(queryStr, queryValues).then(({ rows }) => {
    // task 11 no articles but have topic, then check if topic exists
    if (rows.length === 0 && topic) {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then(({ rows: topicRows }) => {
          // task 11 no article and no topic
          if (topicRows.length === 0) {
            return Promise.reject({ status: 404, msg: "404 Not Found" });
          } else {
            return [];
          }
        });
    }
    return rows;
  });
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
