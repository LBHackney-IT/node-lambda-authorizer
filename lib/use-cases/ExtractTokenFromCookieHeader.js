const cookie = require('cookie');

module.exports = function extractTokenFromCookieHeader(e) {
  if (!e.headers) return null;
  const cookies = e.headers.Cookie || e.headers.cookie;
  if (!cookies) return null;
  const parsedCookies = cookie.parse(cookies);
  console.log('Cookies: ', parsedCookies)
  return parsedCookies['hackneyToken'];
};
