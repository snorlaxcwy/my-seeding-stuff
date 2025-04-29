const db = require("../db/connection");

//John reminds to use SELECT * rather than specific keys
exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
