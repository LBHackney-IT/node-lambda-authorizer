module.exports = function userInAllowedGroup(userGroups, allowedGroups) {
  return userGroups && userGroups.some(g => allowedGroups.includes(g)); // do the groups intersect?
};
