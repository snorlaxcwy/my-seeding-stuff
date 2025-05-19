const db = require("../db/connection");

//Task 9
exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};

//Task 15
exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Not Found" });
      }
      return rows[0];
    });
};
