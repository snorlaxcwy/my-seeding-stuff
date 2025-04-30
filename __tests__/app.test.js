const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles.js");
require("jest-sorted");

beforeEach(() => {
  jest.spyOn(Date, "now").mockImplementation(() => 1594329060000);
  return seed(data);
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  return db.end();
});

describe("1. GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("2. GET /api/topics", () => {
  test("2a. 200: responds with array of topcs including slug & description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        // expect(Array.isArray(topics)).toBe(true); <-- this is not useful
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("2b. 404: responds with error if route not found", () => {
    return request(app)
      .get("/api/287dshbdnotatopic") //<-- John reminds this is any incorrect route
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
describe("3. GET /api/articles/:article_id", () => {
  /*  test("3a. 200: Responds with an object with all articles properties by article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  }); */ //<== similar to test 3b commented by Langa
  test("3b. 200: Responds with an object with all articles properties by article_id=1", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          //console.log(new Date(1594329060000).toISOString()),
          expect.objectContaining({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            /*timestamp to iso
    https://www.timestamp-converter.com/  */
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
  test(" 3c. 400: Responds with bad request - invalid route/path", () => {
    return request(app)
      .get("/api/articles/abclalala")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("3d. 404: Responds with any valid route but not exist", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
describe("4. Get /api/articles", () => {
  test("4a. 200: Respond with array of article object without body and all required keys ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(Array.isArray(articles)).toBe(true);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("4b. 200: Respond with articles sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("4c. 200: each article's comment_count matches expected total from test data", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        const articleWithComments = articles.find(
          (article) => article.article_id === 3
        );
        expect(articleWithComments.comment_count).toBe(2);
      });
  });
});
describe("5. Get /api/articles/:article_id/comments", () => {
  test("5a. 200: Responds with array of comments sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          );
        });
      });
  });
  test("5b. 200: Reponds with detailing array when article_id=3", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([
          {
            comment_id: expect.any(Number),
            body: "Ambidextrous marsupial",
            votes: 0,
            author: "icellusedkars",
            created_at: "2020-09-19T23:10:00.000Z",
            article_id: 3,
          },
          {
            comment_id: expect.any(Number),
            body: "git push origin master",
            votes: 0,
            author: "icellusedkars",
            created_at: "2020-06-20T07:24:00.000Z",
            article_id: 3,
          },
        ]);
      });
  });
  test("5c. 200: Responds with empty array with valid article but no comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("5d. 404: article_id valid but not found ", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
  test("5e. 400: invalid article_id", () => {
    return request(app)
      .get("/api/articles/abcde/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
});
describe.skip("6. POST /api/articles/:article_id/comments", () => {
  test("6a. 201: Responds with new posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "butter_bridge", body: "Nice nice!" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "Nice nice!",
            votes: 0,
            author: "butter_bridge",
            article_id: 3,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("6b. 400: missing body or usename of new comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("6c. 400: invalid article_id", () => {
    return request(app)
      .post("/api/articles/abcde/comments")
      .send({ username: "butter_bridge", body: "Nice nice!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("6d. 404 valid id but article not exist", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({ username: "butter_bridge", body: "Nice nice!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
