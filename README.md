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
