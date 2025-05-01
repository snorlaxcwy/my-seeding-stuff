const db = require("../db/connection");

//Task 9
exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};
