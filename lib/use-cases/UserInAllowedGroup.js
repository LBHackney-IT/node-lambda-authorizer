module.exports = function userInAllowedGroup(userGroups, allowedGroups) {
  if (!(userGroups && userGroups.length !== undefined)) return false;

  for (const group of userGroups) {
    if (allowedGroups.indexOf(group) >= 0) return true;
  }

  return false;
};
