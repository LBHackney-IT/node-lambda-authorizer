const extractTokenFromAuthHeader = require('./ExtractTokenFromAuthHeader');
const extractTokenFromCookieHeader = require('./ExtractTokenFromCookieHeader');
const extractTokenFromUrl = require('./ExtractTokenFromUrl');
const decodeToken = require('./DecodeToken');
const userInAllowedGroup = require('./UserInAllowedGroup');

module.exports = function(options) {
  const jwtSecret = options.jwtSecret;
  const allowedGroups = options.allowedGroups;
  const customAuthorize = options.customAuthorize;

  const getToken = event => {
    return (
      extractTokenFromAuthHeader(event) ||
      extractTokenFromCookieHeader(event) ||
      extractTokenFromUrl(event)
    );
  };

  const userIsAllowed = decodedToken => {
    return userInAllowedGroup(decodedToken.groups, allowedGroups);
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
        const decodedToken = decodeToken(token, jwtSecret);
        if (customAuthorize) {
          if (!customAuthorize(decodedToken, event)) return 'Not Allowed';
        } else {
          if (!decodedToken) return 'Unauthorized';
          if (!userIsAllowed(decodedToken)) return 'Not Allowed';
        }
        return allow(event.methodArn);
      } catch (err) {
        console.log(err);
      }
    }
  };
};
