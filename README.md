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

# Create environment variable files

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
