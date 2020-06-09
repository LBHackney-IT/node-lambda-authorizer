const extractTokenFromAuthHeader = require('./ExtractTokenFromAuthHeader');
const extractTokenFromCookieHeader = require('./ExtractTokenFromCookieHeader');
const extractTokenFromUrl = require('./ExtractTokenFromUrl');
const decodeToken = require('./DecodeToken');
const userInAllowedGroup = require('./UserInAllowedGroup');

module.exports = options => {
  const jwtSecret = options.jwtSecret;
  const allowedGroups = options.allowedGroups;
  const customAuthorize = options.customAuthorize;
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

  const getPolicy = (resource, allowed) => {
    const policy = {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: allowed ? 'Allow' : 'Deny',
            Resource: resource
          }
        ]
      }
    };
    if (isDebug) {
      console.log('POLICY: ');
      console.log(policy);
    }
    return policy;
  };

  return {
    execute: async event => {
      try {
        if (isDebug) {
          console.log('EVENT: ');
          console.log(event);
        }

        const token = getToken(event);
        if (isDebug) console.log(`TOKEN: ${token}`);

        const decodedToken = decodeToken(token, jwtSecret);
        if (isDebug) {
          console.log('DECODED TOKEN: ');
          console.log(decodedToken);
        }

        let userAllowed;
        if (customAuthorize) {
          userAllowed = customAuthorize(decodedToken, event);
        } else {
          if (!decodedToken) return getPolicy(event.methodArn, false);
          userAllowed = userIsAllowed(decodedToken);
        }
        if (isDebug) console.log(`USER ALLOWED: ${userAllowed}`);
        if (!userAllowed) return getPolicy(event.methodArn, false);

        return getPolicy(event.methodArn, true);
      } catch (err) {
        console.log(err);
      }
    }
  };
};
