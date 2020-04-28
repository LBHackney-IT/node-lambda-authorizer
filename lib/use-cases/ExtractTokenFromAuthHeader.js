module.exports = function extractTokenFromAuthHeader(e) {
  if (!(e.headers && e.headers.Authorization)) return null;
  if (e.headers.Authorization.startsWith('Bearer')) {
    return e.headers.Authorization.replace('Bearer ', '');
  }
  return null;
};
