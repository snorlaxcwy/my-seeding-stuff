# NC News Seeding

this is a Back End project: creating and seeding a test and development database with articles, users, comments and topics.

# Project Setup

git clone https://github.com/snorlaxcwy/my-seeding-stuff.git

# Install dependencies (package.json)

npm insatll
=> this is including
pg - PostegreSQL for Node.js
dotenv - for managaing environment variables
pg-format - for formatting safe SQL queries in the seed script
jest - for testing

# SETUP local environment variable files

.env.development
.env.test
=> need to put them into the root folder but not db

# Create Database

npm run setup-dbs

# create table

- dropTables()
- createTables()

and then test createTables by using db.query

npm run test-seed to test each codings

# seeding the database

npm run seed-dev
npm run test-seed

# run Queries

node query.js
=> all output to output.txt

##### Git Branching

# Local

    git checkout main
    git pull origin main
    git checkout -B file-name

## if delete

    git checkout main <go to main first>
    git branch -D file-name

# 1. GET /api

    - new branch

    ## commit changes regularly:

    - create controller
    - apps.js + route
    - happy path test + error handling test
    - endpoints.json update
    - listen.js ( => node listen.js)

    ## sumbit changes

    ## git push origin file-nmae

    ## go github to create pull request

    ## confirm no merge conflict, and confirm to merge to the main

    ## URL of the pull request > /nchelp pr command on Slack (no. of task and name)

    ## git checkout main > git pull origin main

# 2. GET /api/topics

    -new branch
    -write test
    -model
    -controller
    -update app
    -update endpoints
    -test
    -push and pull

# 3. GET /api/articles/:article_id

    - new branch
    - write test : happy path & error cases
    - happy path: get all article properties by the article_id inclduing author,title,article_id,body,topic,created_at(timestmap number),votes,article_img_url
    - created_at need jest.fn to work on the test (timestamp to iso
    https://www.timestamp-converter.com/ || new Date(1594329060000).toISOString())
    - model : db query => 404
    - controller => link model
    - add new route to app.js
    - update endpoints.json
    - pass all test
    - push and pull

# 4 GET /api/articles

    - new branch
    - get all articles sorted by date in desc
    - no body property present on any of the article objects
    - happy path test : return author,title,article_id, topic,created_at(timestmap number),votes,article_img_url, comment_count(comments table)
    - require("jest-sorted");
    - comment_count can't use js, need to make use of queries to the database => no 400/404 as not query str
    - *no body
    - tests : 200, 200 with corrected order, 200 with object no body
    - using previous model and conttollers
    - client -> controller -> model(sql) -> db.query(quesrtStr) send to PostgreSQL -> SQL query get data + count comments + sortby -> result.rows -> go back to controller > client
    - seeding => title → article_id lookup mapping, if not test will fail
    - add new route to app.js
    - update endpoints.json
    - pass all test
    - push and pull

# 5 GET /api/articles/:article_id/comments

    - new branch
    - get all comments from an article_id
    - happy path test : return an array with comments including comment_id, votes, created_at, author, body, article_id
    - comment order by created_at DESC
    - created_at => ISO string
    - test with valid_id but no comments=>[]
    - 404 & 400 error case handling
    - create comment model & controller
    - add route to apps.js
    - pass all test
    - update endpoints
    - push and pull

# 6 POST /api/articles/:article_id/comments

    - new branch
    - post new comments under specific article_id
    - happy path : 201 - inlcuding comment_id, body, votes, author, article_id, created_at
    - must have : username, body
    - errors: 400 X username/body/article_id, 404 article_id valid but not exist
    - model + controller(POST)
    - app.js add route
    - pass all test
    - update endpoints
    - push and pull

# 7 PATCH /api/articles/:article_id

    - new branch
    - adjust votes with specific article_id
    - backend : req.params.article_id take id > increase/reduce votes from req.body.inc_votes > confirm inc_votes is number > check article_id exists > sql update articles.votes > update article object
    - happy path : 200 - return updated votes in article object
    - errors : 400 - article_id/inc_votes is not number/invalid, 404 - article_id is valid but not exist
    - articles > model + controllers
    - app.js add route
    - pass all test
    - update endpoints
    - push and pull

# 8 DELETE /api/comments/:comment_id

    - pull and new branch
    - target : delete comment by comment_id
    - happy path : 204 - No Content
    - errors : 400 - comment_id is invalid(!Number)
    - errors : 404 - comment_id is valid(Number) but not exsit
    - folder comments> model + controller
    - add route app.delete in apps.js
    - pass all tests
    - update endpoints
    - push and pull

# 9 GET /api/users

    - pull and new branch
    - target: get all users with array of object
    - happy path: 200 inlcluding [{username,name,avatar_url},{username,name,avatar_url}]
    - errors : 500 - db errors
    - users > model + controller
    - add rounte to app.get in app.js
    - pass all test
    - updates endpoints
    - push and pull

# 10 GET /api/articles (sorting queries)

    - pull and new branch
    - target : get all articles with query default sorted by created_at and order by either ASC || DESC
    - happy path: ?order=asc (default created_at DESC->newly added date)
    - happy path: ?sort_by=title
    - happy path: ?sort_by=topic&order=asc
    - Errors : ?sort_by=abcde(invalid column) => 400 Bad Request
    - Errors : ?order=number(invalid order) => 400 Bad Request
    - articles > model + controller ( update Task 4 content)
    - pass all tests
    - update endpoints
    - push and pull

# 11 GET /api/articles (topic query)

    - pull and new branch
    - target : get articles with query by topic
    - happy path: ?topic=cats
    - happy path: /api/articles => return all articles
    - happy path: ?topic=paper => valid topic but no article found return empty array
    - error: invalid topic => ?topic=abcdef return 404 Not Found
    - articles > model + controller (update task 10)
    - pass all tests
    - update endpoints
    - push and pull

# 12 GET /api/articles/:article_id (comment_count)

    - pull and new branch
    - target : add comment_count into articles
    - happy path : return correct count to the articles
    - edge case : with article but no comment
    - no JS in controller
    - update articles > Task 3 model + controller
    - pass all tests
    - update endpints
    - push and pull

# 13 Host application

1. Supabase > new project + pw +url (Transaction pooler)
2. .env.production > DATABASE_URL=URL
3. change connection.js
4. listen.js
5. package.json
   "main": "listen.js",
   "scripts": {
   "start": "node listen.js",
   "seed-prod": "NODE_ENV=production npm run seed"
   }
6. git commit and push
7. npm run seed-prod
8. render> web services > link git >
   Build Command: yarn
   Start Command: yarn start
   Environment Variables：
   DATABASE_URL = URL
   NODE_ENV = production
9. test api : https://snorlax-7fa6.onrender.com

# 14 README

# 15 Express Routers => refactor app.js

- before refactoring :
  - pass all test
  - commit all codes
  - api : render will auto deploy
  - need to update endpoints.json
- no effect on :
  - supabase database
  - .env.production
  - seed-prod / run-seed.js
  - database
- mkdir routes, touch api-router.js > routes/api-router.js
- api-router.js >
  const express = require("express");
  const apiRouter = express.Router();
  change app.get to apiRouter
  module.exports = apiRouter;
- app.js >
  const apiRouter = require("./routes/api-router");
  app.use("/api", apiRouter);
- npm start
- browser : http://localhost:9090/api
  ## subrouters
  - example
  - main : api-routers.js => sub :routes/users-router.js
  - api-router.js
    const userRouter = require("./users-router");
    apiRouter.use("/users", userRouter);
- users-router.js
  const userRouter = require("express").Router();
  const { getAllUsers } = require("../controllers/users.controller");
  userRouter.get("/", getAllUsers);
  module.exports = userRouter;
- npm start
- browser to check if api response : http://localhost:9090/api
- npm test > all tests passed
- if not, change the path in routes (if path is correct => route is just keep "/")

# 16 GET /api/users/:username

- pull and new branch
- backend : client > app.js > apiRouter > userRouter > controller > model（check db）> response/error
- happy path : 200 - return user object{ username, avatar_url, name} by user_name
- errors : 404 Not Found ( username could be either number || string )
- update users > model & controller
- update /routes/users-routes.js
- pass all tests
- update endpoints.json
- push and pull

# 17 PATCH /api/comments/:comment_id

# 18 POST /api/articles

# 19

# 20

# 21 POST /api/topics

    - topics.model => insertTopic()
    - topics.contoller.js => postTopic()
    - create route:topic.router.js
    - update api-router
    - update endpoint
