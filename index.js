const jwt = require('jsonwebtoken');
const cookie = require('cookie');

exports = function (config) { 
  const jwt_secret = config.jwtsecret;
  const allowedGroups = config.allowedGroups;

  const allow = resource => {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: resource
          }
        ]
      }
    };
  };

  function extractTokenFromAuthHeader(e) {
    if (!(e.headers && e.headers.Authorization)) return null;
    if (e.headers.Authorization.startsWith('Bearer')) {
      return e.headers.Authorization.replace('Bearer ', '');
    }
  }

  function extractTokenFromCookieHeader(e) {
    if (!(e.headers && e.headers.Cookie)) return null;
    const cookies = cookie.parse(e.headers.Cookie);
    return cookies['hackneyToken'];
  }

  function extractTokenFromUrl(e) {
    if (!(e.queryStringParameters && e.queryStringParameters.authToken))
      return null;
    return e.queryStringParameters.authToken;
  }

  function decodeToken(token) {
    try {
      return jwt.verify(token, jwt_secret);
    } catch (err) {
      return false;
    }
  }

  function userInAllowedGroup(userGroups) {
    if (!(userGroups && userGroups.length !== undefined)) return false;
    if (allowedGroups.indexOf("*") >= 0) return true;
    for (const group of userGroups) {
      if (allowedGroups.indexOf(group) >= 0) return true;
    }
  }
  
  return async (event) => {
    try {
      const token =
        extractTokenFromAuthHeader(event) ||
        extractTokenFromCookieHeader(event) ||
        extractTokenFromUrl(event);
      const decodedToken = decodeToken(token);
      if (token && decodedToken && userInAllowedGroup(decodedToken.groups)) {
        return allow(event.methodArn);
      } else {
        return 'Unauthorized';
      }
    } catch (err) {
      console.log(err);
    }
  }
};
