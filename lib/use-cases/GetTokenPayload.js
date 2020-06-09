const extractTokenFromAuthHeader = require('./ExtractTokenFromAuthHeader');
const extractTokenFromCookieHeader = require('./ExtractTokenFromCookieHeader');
const extractTokenFromUrl = require('./ExtractTokenFromUrl');
const decodeToken = require('./DecodeToken');

module.exports = options => {
  const jwtSecret = options.jwtSecret;

  return event => {
    const token =
      extractTokenFromAuthHeader(event) ||
      extractTokenFromCookieHeader(event) ||
      extractTokenFromUrl(event);
    try {
      return decodeToken(token, jwtSecret);
    } catch (err) {
      return false;
    }
  };
};
