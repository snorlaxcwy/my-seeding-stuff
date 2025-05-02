const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

//initialize an empty config object
const config = {};
//connect to supabase if it's production env
if (ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set for production");
  }
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

// connect to database
const db = new Pool(config);

// to check dev/test need to have PGDATABASE; Production need to have URL
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

if (ENV !== "production") {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

module.exports = db;
