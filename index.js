const Authorizer = require('./lib/use-cases/Authorizer');
const GetTokenPayload = require('./lib/use-cases/GetTokenPayload');

module.exports = function(config) {
  const authorizer = new Authorizer({
    jwtSecret: config.jwtSecret,
    allowedGroups: config.allowedGroups
  });

  const getTokenPayload = new GetTokenPayload({
    jwtSecret: config.jwtSecret
  });

  const handler = async event => {
    return authorizer.execute(event);
  };

  return { handler, getTokenPayload };
};
