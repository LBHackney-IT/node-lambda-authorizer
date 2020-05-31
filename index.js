const Authorizer = require('./lib/use-cases/Authorizer');
const GetTokenPayload = require('./lib/use-cases/GetTokenPayload');

module.exports = function(config) {
  console.log('INIT AUTHORIZER');
  const authorizer = Authorizer({
    jwtSecret: config.jwtSecret,
    allowedGroups: config.allowedGroups,
    isDebug: config.debug === 'true'
  });

  const getTokenPayload = GetTokenPayload({
    jwtSecret: config.jwtSecret
  });

  const handler = async event => {
    if (config.debug) {
      console.log('HANDLER EVENT: ');
      console.log(event);
    }
    return authorizer.execute(event);
  };

  return { handler, getTokenPayload };
};
