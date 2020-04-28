const cookie = require("cookie");

module.exports = function extractTokenFromCookieHeader(e) {
  if (!(e.headers && e.headers.Cookie)) return null;
  const cookies = cookie.parse(e.headers.Cookie);
  return cookies["hackneyToken"];
};