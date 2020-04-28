const Authorizer = require("./lib/use-cases/Authorizer");

module.exports = function(config) {
  const authorizer = new Authorizer({
    jwtSecret: config.jwtSecret,
    allowedGroups: config.allowedGroups
  });

  return async event => {
    return authorizer.execute(event);
  };
};
