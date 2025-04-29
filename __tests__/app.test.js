const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles.js");

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
  test("3a. 200: Responds with an object with all articles properties by article_id", () => {
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
  });
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
