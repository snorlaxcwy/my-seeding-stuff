const db = require(`./connection.js`);
const fs = require("fs");

// Get all of the users
db.query(`SELECT * FROM users;`)
  .then(({ rows: users }) => {
    const title = `# Get all of the users`;
    const output = title + JSON.stringify(users, null, 2);
    // print to output.txt
    fs.writeFile(`output.txt`, output, (err) => {
      if (err) throw err;
      console.log("Saved to output.txt!");
    });

    // Get all of the articles where the topic is coding
    return db.query(`SELECT * FROM articles WHERE topic = 'coding'`);
  })
  .then(({ rows: articles }) => {
    const title = `# Get all of the articles where the topic is coding`;
    const content = JSON.stringify(articles, null, 2);
    fs.appendFile(`output.txt`, title + content, (err) => {
      if (err) throw err;
      console.log(
        `Saved the articles where the topic is coding to output.txt!`
      );
    });
    // Get all of the comments where the votes are less than zero
    return db.query(`SELECT * FROM comments WHERE votes < 0;`);
  })
  .then(({ rows: comments }) => {
    const title = `# Get all of the comments where the votes are less than zero`;
    const content = JSON.stringify(comments, null, 2);
    fs.appendFile(`output.txt`, title + content, (err) => {
      if (err) throw err;
      console.log(
        `Saved the comments where the votes are less than zero to output.txt!`
      );
    });
    // Get all of the topics
    return db.query(`SELECT * FROM topics;`);
  })
  .then(({ rows: topics }) => {
    const title = `# Get all of the topics`;
    const content = JSON.stringify(topics, null, 2);
    fs.appendFile(`output.txt`, title + content, (err) => {
      if (err) throw err;
      console.log(`Save all of the topics to output.txt!`);
    });
    // Get all of the articles by user grumpy19
    return db.query(`SELECT * FROM articles WHERE author = 'grumpy19'`);
  })
  .then(({ rows: articles }) => {
    const title = `# Get all of the articles by user grumpy19`;
    const content = JSON.stringify(articles, null, 2);
    fs.appendFile(`output.txt`, title + content, (err) => {
      if (err) throw err;
      console.log(`Saved articles by user grumpy19 to output.txt!`);
    });
    // Get all of the comments that have more than 10 votes.
    return db.query(`SELECT * FROM comments WHERE votes > 10`);
  })
  .then(({ rows: comments }) => {
    const title = `# Get all of the comments that have more than 10 votes`;
    const content = JSON.stringify(comments, null, 2);
    fs.appendFile(`output.txt`, title + content, (err) => {
      if (err) throw err;
      console.log(`Saved comments that have more than 10 votes to output.txt`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
