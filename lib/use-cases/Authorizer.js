const extractTokenFromAuthHeader = require('./ExtractTokenFromAuthHeader');
const extractTokenFromCookieHeader = require('./ExtractTokenFromCookieHeader');
const extractTokenFromUrl = require('./ExtractTokenFromUrl');
const decodeToken = require('./DecodeToken');
const userInAllowedGroup = require('./UserInAllowedGroup');

module.exports = function(options) {
  const jwtSecret = options.jwtSecret;
  const allowedGroups = options.allowedGroups;

  const getToken = event => {
    return (
      extractTokenFromAuthHeader(event) ||
      extractTokenFromCookieHeader(event) ||
      extractTokenFromUrl(event)
    );
  };

  const userIsAllowed = token => {
    const decodedToken = decodeToken(token, jwtSecret);
    return (
      decodedToken && userInAllowedGroup(decodedToken.groups, allowedGroups)
    );
  };

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

  return {
    execute: async event => {
      try {
        const token = getToken(event);
        if (userIsAllowed(token)) {
          return allow(event.methodArn);
        }
        return 'Unauthorized';
      } catch (err) {
        console.log(err);
      }
    }
  };
};
