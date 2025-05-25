const db = require("../db/connection");

//John reminds to use SELECT * rather than specific keys
exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.insertTopic = ({ slug, description, img_url }) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }
  //to check if img_url avaliable
  const query = img_url
    ? `INSERT INTO topics(slug,description,img_url) VALUES ($1,$2,$3) RETURNING *;`
    : `INSERT INTO topics(slug,description) VALUES ($1,$2) RETURNING *;`;

  //return params => with img_url or not
  const params = img_url ? [slug, description, img_url] : [slug, description];
  return db.query(query, params).then(({ rows }) => rows[0]);
};
