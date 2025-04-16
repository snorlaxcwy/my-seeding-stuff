const db = require("../../db/connection");

function convertTimestampToDate({ created_at, ...otherProps }) {
  if (!created_at) return { ...otherProps };
  return { created_at: new Date(created_at), ...otherProps };
}

module.exports = { convertTimestampToDate };
