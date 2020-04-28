module.exports = function extractTokenFromAuthHeader(e) {
  if (!(e.queryStringParameters && e.queryStringParameters.authToken))
    return null;
  return e.queryStringParameters.authToken;
};
