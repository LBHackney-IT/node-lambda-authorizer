const jwt = require("jsonwebtoken");

module.exports = function decodeToken(token, jwt_secret) {
  try {
    return jwt.verify(token, jwt_secret);
  } catch (err) {
    return false;
  }
};
