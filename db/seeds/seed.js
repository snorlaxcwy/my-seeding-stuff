const db = require("../connection");
const format = require("pg-format");
/*
//Drop the tables first
const seed = ({ topicData, userData, articleData, commentData }) => {
  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
      .then(() => db.query(`DROP TABLE IF EXISTS users;`))
      .then(() => db.query(`DROP TABLE IF EXISTS topics;`))

      //Create the tables
      .then(() => {
        return db.query(`
        CREATE TABLE topics (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR(500) NOT NULL,
        img_url VARCHAR(1000)
         );
      `);
      })

      .then(() => {
        return db.query(`
         CREATE TABLE users (
         username VARCHAR(50) PRIMARY KEY,
         name VARCHAR(80) NOT NULL,
         avatar_url VARCHAR(1000)
         );
      `);
      })

      .then(() => {
        return db.query(`
         CREATE TABLE articles (
         article_id SERIAL PRIMARY KEY,
         title VARCHAR(50) NOT NULL,
         topic VARCHAR REFERENCES topics(slug),
         author VARCHAR REFERENCES users(username),
         body TEXT NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         votes INT DEFAULT 0,
         article_img_url VARCHAR(1000)
         );
        `);
      })

      .then(() => {
        return db.query(`
         CREATE TABLE comments (
         comment_id SERIAL PRIMARY KEY,
         article_id INT REFERENCES articles(article_id),
         body TEXT NOT NULL,
         votes INT DEFAULT 0,
         author VARCHAR REFERENCES users(username),
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
      `);
      })
  );
};
*/

function seed({ topicData, userData, articleData, commentData }) {
  // <-this is what we received, array of object, we could see from topic.js
  return (
    db
      // Drop tables
      .query("DROP TABLE IF EXISTS comments;")
      .then(() => db.query("DROP TABLE IF EXISTS articles;"))
      .then(() => db.query("DROP TABLE IF EXISTS users;"))
      .then(() => db.query("DROP TABLE IF EXISTS topics;"))

      .then(() => {
        // Create tables
        return db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR(500) NOT NULL,
          img_url VARCHAR(1000)
        );
      `);
      })

      .then(() => {
        return db.query(`
        CREATE TABLE users (
          username VARCHAR(50) PRIMARY KEY,
          name VARCHAR(80) NOT NULL,
          avatar_url VARCHAR(1000)
        );
      `);
      })

      .then(() => {
        return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(50) NOT NULL,
          topic VARCHAR REFERENCES topics(slug),
          author VARCHAR REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `);
      })

      .then(() => {
        return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id),
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      })

      //insert topic data
      .then(() => {
        const formattedTopics = topicData.map(
          // turning objects into array in array
          ({ slug, description, img_url }) => [slug, description, img_url]
        );
        const insertTopicsQuery = format(
          `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
          formattedTopics
        );
        return db.query(insertTopicsQuery);
      })
  );
}
module.exports = seed;
