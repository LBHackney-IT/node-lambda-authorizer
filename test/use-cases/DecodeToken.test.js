const decodeToken = require('../../lib/use-cases/DecodeToken');
const jwt = require('jsonwebtoken');

describe('decodeToken', function() {
  it('returns false if the token does not have the jwt secret', async function() {
    const result = decodeToken('decoded_token', 'secret');

    expect(result).toBe(false);
  });

  it('returns the decoded token if the encrypted token has the right signiture', async function() {
    const secret = 'some secret';
    const encryptedToken = jwt.sign('super-secret-token', secret);
    const result = decodeToken(encryptedToken, secret);

    expect(result).toBe('super-secret-token');
  });
});
