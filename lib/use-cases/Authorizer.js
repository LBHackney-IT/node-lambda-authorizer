const extractTokenFromAuthHeader = require("../../lib/use-cases/ExtractTokenFromAuthHeader");
const extractTokenFromCookieHeader = require("../../lib/use-cases/ExtractTokenFromCookieHeader");
const extractTokenFromUrl = require("../../lib/use-cases/ExtractTokenFromUrl");
const decodeToken = require("../../lib/use-cases/DecodeToken");
const userInAllowedGroup = require("../../lib/use-cases/UserInAllowedGroup");

module.exports = function(options) {
  const jwtSecret = options.jwtSecret;
  const allowedGroups = options.allowedGroups;
  const allow = resource => {
    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: resource
          }
        ]
      }
    };
  };

  return {
    execute: async function(event) {
      try {
        const token =
          extractTokenFromAuthHeader(event) ||
          extractTokenFromCookieHeader(event) ||
          extractTokenFromUrl(event);
        const decodedToken = decodeToken(token, jwtSecret);
        console.log(decodedToken);
        if (
          token &&
          decodedToken &&
          userInAllowedGroup(decodedToken.groups, allowedGroups)
        ) {
          return allow(event.methodArn);
        } else {
          return "Unauthorized";
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
};
