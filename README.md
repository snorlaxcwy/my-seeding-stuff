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
    git pull origi main
    git checkout -B file-name

## if delete

    git checkout main <go to main first>
    git banch -D file-name

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
    - superytest >> async/await
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
