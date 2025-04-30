const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

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
          username VARCHAR(100) PRIMARY KEY,
          name VARCHAR(80) NOT NULL,
          avatar_url VARCHAR(1000)
        );
      `);
      })

      .then(() => {
        return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          topic VARCHAR REFERENCES topics(slug),
          author VARCHAR(100) REFERENCES users(username),
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

      //insert topics data
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

      //insert users data
      .then(() => {
        const formattedUsers = userData.map(
          ({ username, name, avatar_url }) => [username, name, avatar_url]
        );
        const insertTopicsQuery = format(
          `INSERT INTO users ( username, name, avatar_url) VALUES %L RETURNING *;`,
          formattedUsers
        );
        return db.query(insertTopicsQuery);
      })

      //insert articles data
      .then(() => {
        const formattedArticles = articleData.map((article) => {
          const {
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          } = article;
          const { created_at: formattedDate } = convertTimestampToDate({
            created_at,
          });
          return [
            title,
            topic,
            author,
            body,
            formattedDate,
            votes,
            article_img_url,
          ];
        });
        const insertArticlesQuery = format(
          `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
          formattedArticles
        );
        return db.query(insertArticlesQuery);
      })

      //insert comments data
      //no need to insert comment_id, its SERIAL PRIMARY KEY
      // insert comments data
      .then((articlesResult) => {
        const articleRows = articlesResult.rows;

        // 1. build lookup object: title -> article_id
        const articleLookup = articleRows.reduce((acc, article) => {
          acc[article.title] = article.article_id;
          return acc;
        }, {});

        // 2. format comment data（change title to article_id）
        const formattedComments = commentData.map((comment) => {
          const { article_title, body, votes, author, created_at } = comment;
          const article_id = articleLookup[article_title];
          //  chnage title to article_id
          const { created_at: formattedDate } = convertTimestampToDate({
            created_at,
          });
          return [article_id, body, votes, author, formattedDate];
        });

        // 3. insert comment
        const insertCommentsQuery = format(
          `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
          formattedComments
        );
        return db.query(insertCommentsQuery);
      })
  );
}
module.exports = seed;
