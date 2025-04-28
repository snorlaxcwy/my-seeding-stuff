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
    git pull origi main <confirm get all the updated data from git>
    git branch -B file-name

## if delete

    git checkout main <go to main first>
    git banch -D file-name

# GET /api

- new branch

# commit changes regularly:

- create controller
- apps.js + route
- happy path test + error handling test
- endpoints.json update
- listen.js ( > node listen.js)

# sumbit changes

# git push origin file-nmae

# go git hub to create pull request

# confirm no merge conflict, and confirm to merge to the main

# URL of the pull request > /nchelp pr command on Slack (no. of task and name)

# git checkout main > git pull origin main
