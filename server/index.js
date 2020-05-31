const authorizer = require('../index')({
  jwtSecret: 'INSERT_SECRET_HERE',
  allowedGroups: 'INSERT_GROUP_HERE',
  debug: 'true'
});

module.exports.handler = async event => {
  await authorizer.handler(event);
};
