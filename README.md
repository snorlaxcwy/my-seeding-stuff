## NC News API

This is a RESTful API for the NC News project. It provides access to articles, topics, users, and comments stored in a PostgreSQL database.

## Hosted Version

Visit the live site here: https://snorlax-7fa6.onrender.com

## Available Endpoints

Visit `/api` to view all available endpoints and their descriptions in JSON format.

## Getting Started Locally

dev log please refer to dev-note.md

### 1. Clone the repository

git clone https://github.com/snorlaxcwy/my-seeding-stuff.git
cd your-repo-name

### npm install

### Environment Variables

.env.development:PGDATABASE=nc_news
.env.test:PGDATABASE=nc_news_test
For production hosting (e.g. Render), create a .env.production with:
DATABASE_URL=your_supabase_transaction_pooler_url
NODE_ENV=production

### Set up the databases

npm run setup-dbs

### Seed the database

npm run seed-dev # for development
npm run seed-test # for test
npm run seed-prod # for production hosting

### Run tests

npm test

### dev / dev.dep

Node.js v18+
PostgreSQL v14+
Express
Jest (for testing)
pg-format
dotenv
