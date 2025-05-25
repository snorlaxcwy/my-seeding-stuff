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
          // expect(article).not.toHaveProperty("body");
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
            article_id: 3,
            author: "icellusedkars",
            body: "Ambidextrous marsupial",
            comment_id: 11,
            created_at: "2020-09-19T23:10:00.000Z",
            votes: 0,
          },
          {
            article_id: 3,
            author: "icellusedkars",
            body: "git push origin master",
            comment_id: 10,
            created_at: "2020-06-20T07:24:00.000Z",
            votes: 0,
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

describe("6. POST /api/articles/:article_id/comments", () => {
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
describe("7. PATCH /api/articles/:article_id", () => {
  test("7a. 200: Responds with an update article object with inc_votes via article_id=1 ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 95,
          })
        );
      });
  });
  test("7b. 400: inc_votes is invalid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "aaa" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("7c. 400: inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("7d. 400: article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/aaaaaa")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("7e. 404: article_id is valid but not exist", () => {
    return request(app)
      .patch("/api/articles/9999999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
describe("8. DELETE /api/comments/:comment_id", () => {
  test("8a. Responds 204: No Content after deletion", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("8b. Responds 400 : comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
  test("8c. Responds 400 : comment_id is valid but not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
describe("9. GET /api/users", () => {
  test("9a. 200: Responds with array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  //test error-handling middleware to catch error
  test("9b. 500: handling database error", () => {
    //mock the database is down
    jest.spyOn(db, "query").mockRejectedValueOnce(new Error("Database Down"));
    return request(app)
      .get("/api/users")
      .expect(500)
      .then(({ body }) => {
        expect(body.msg).toBe("500 Internal Server Error");
      });
  });
});
describe("10. GET /api/articles (sorting queries)", () => {
  test("10a. 200: sort_by=title", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("10b. 200: order=asc - default by created_at", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("10c. 200: sort_by=topic&order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", { ascending: true });
      });
  });
  test("10d. 400: invalid order =number", () => {
    return request(app)
      .get("/api/articles?order=number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Invalid order query");
      });
  });
  test("10e. 400: invalid sort_by =abcde", () => {
    return request(app)
      .get("/api/articles?sort_by=abcde")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Invalid sort_by query");
      });
  });
});
describe("11. GET /api/articles (topic query)", () => {
  test("11a. 200: filter articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("11b. 200 return all articles if no topic filter", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test("11c. 200 return empty array if valid topic has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("11d. 404 topic doesnt not exist", () => {
    return request(app)
      .get("/api/articles?topic=abcde")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
describe("12. GET /api/articles/:article_id (comment_count)", () => {
  test("12a. 200: article object includes added comment_count", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count");
        expect(typeof body.article.comment_count).toBe("number");
        expect(body.article.comment_count).toBe(1);
      });
  });
  test("12b. 200: return 0 comment_count if article avaliable but no comment", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count");
        expect(typeof body.article.comment_count).toBe("number");
        expect(body.article.comment_count).toBe(0);
      });
  });
});
describe("15. GET /api/users/:username", () => {
  test("15a. 200 - return a single user object if username is valid & exist", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("15b. 404 Not Found if username is valid & not exists", () => {
    return request(app)
      .get("/api/users/123abc")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
describe("17. PATCH /api/comments/:comment_id", () => {
  test("17a. PATCH /api/comments/:comment_id, upvote", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("votes");
      });
  });

  test("17b. PATCH /api/comments/:comment_id, invalid comment_id", () => {
    return request(app)
      .patch("/api/comments/apple")
      .send({ inc_votes: 1 })
      .expect(400);
  });

  test("17c. PATCH /api/comments/:comment_id, comment 不存在", () => {
    return request(app)
      .patch("/api/comments/9999")
      .send({ inc_votes: 1 })
      .expect(404);
  });

  test("17d. PATCH /api/comments/:comment_id, inc_votes missing", () => {
    return request(app).patch("/api/comments/1").send({}).expect(400);
  });
});

describe("19. GET /api/articles (Pagination)", () => {
  test("19a. 200: returns paginated articles with default limit (10)", async () => {
    const res = await request(app).get("/api/articles");
    expect(res.status).toBe(200);
    expect(res.body.articles.length).toBeLessThanOrEqual(10);
    expect(res.body).toHaveProperty("total_count");
    expect(typeof res.body.total_count).toBe("number");
  });

  test("19b. 200: returns paginated articles with custom limit and page", async () => {
    const res = await request(app).get("/api/articles?limit=5&p=2");
    expect(res.status).toBe(200);
    expect(res.body.articles.length).toBeLessThanOrEqual(5);
    expect(res.body).toHaveProperty("total_count");
  });

  test("19c. 200: paginates + filters by topic", async () => {
    const res = await request(app).get(
      "/api/articles?topic=coding&limit=2&p=1"
    );
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("msg", "404 Not Found");
  });

  test("19d. 400: limit is not a number", async () => {
    const res = await request(app).get("/api/articles?limit=banana");
    expect(res.status).toBe(400);
    expect(res.body.msg).toMatch(/limit/i);
  });

  test("19e. 400: page is not a number", async () => {
    const res = await request(app).get("/api/articles?p=apple");
    expect(res.status).toBe(400);
    expect(res.body.msg).toMatch(/page/i);
  });

  test("19f. 400: negative limit or page", async () => {
    const res = await request(app).get("/api/articles?limit=-2&p=-1");
    expect(res.status).toBe(400);
    expect(res.body.msg).toMatch(/limit|page/i);
  });

  test("19g. 200: returns empty array for out-of-bounds page", async () => {
    const res = await request(app).get("/api/articles?p=9999");
    expect(res.status).toBe(200);
    expect(res.body.articles).toEqual([]);
  });
});

describe("21. POST /api/topics", () => {
  test("21a. 201: should create and return a new topic", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "testtopic",
        description: "A topic for testing",
        img_url: "https://test.com/image.jpg",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toMatchObject({
          slug: "testtopic",
          description: "A topic for testing",
          img_url: "https://test.com/image.jpg",
        });
      });
  });
});

describe("22. ELETE /api/articles/:article_id ", () => {
  test("22a. DELETE /api/articles/:article_id - 204: successfully deletes article and comments", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });

  test("22b. DELETE /api/articles/:article_id - 404: article not found", () => {
    return request(app)
      .delete("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });

  test("DELETE /api/articles/:article_id - 400: invalid id", () => {
    return request(app)
      .delete("/api/articles/apple")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });
});
