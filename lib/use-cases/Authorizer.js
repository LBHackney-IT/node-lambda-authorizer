const extractTokenFromAuthHeader = require('./ExtractTokenFromAuthHeader');
const extractTokenFromCookieHeader = require('./ExtractTokenFromCookieHeader');
const extractTokenFromUrl = require('./ExtractTokenFromUrl');
const decodeToken = require('./DecodeToken');
const userInAllowedGroup = require('./UserInAllowedGroup');

module.exports = options => {
  const jwtSecret = options.jwtSecret;
  const allowedGroups = options.allowedGroups;
  const isDebug = options.isDebug;

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
        if (isDebug) {
          console.log('EVENT: ');
          console.log(event);
        }
        const token = getToken(event);
        if (isDebug) {
          console.log('TOKEN: ');
          console.log(token);
        }
        console.log(jwtSecret);
        const decodedToken = decodeToken(token, jwtSecret);
        if (isDebug) {
          console.log('DECODED TOKEN: ');
          console.log(decodedToken);
        }
        if (!decodedToken) return 'Unauthorized';
        const userAllowed = userIsAllowed(decodedToken);
        if (isDebug) {
          console.log('USER ALLOWED: ');
          console.log(userAllowed);
        }
        if (!userAllowed) return 'Not Allowed';
        const policy = allow(event.methodArn);
        if (isDebug) {
          console.log('POLICY: ');
          console.log(policy);
        }
        return policy;
      } catch (err) {
        console.log(err);
      }
    }
  };
};
