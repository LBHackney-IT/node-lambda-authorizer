const GetTokenPayload = require('../../lib/use-cases/GetTokenPayload');
const jwt = require('jsonwebtoken');

describe('GetTokenPayload', function() {
  it('returns null if the request does not have the right secrets', async function() {
    const jwtSecret = 'secret';
    const getTokenPayload = new GetTokenPayload({
      jwtSecret: jwtSecret
    });
    expect(getTokenPayload({})).toBe(false);
  });

  it('returns the decoded token if the request have the right secrets', async function() {
    const jwtSecret = 'secret';
    const getTokenPayload = new GetTokenPayload({
      jwtSecret: jwtSecret
    });

    const token = { token: 'super-secret-token', groups: ['Friends'] };
    const encryptedToken = jwt.sign(token, jwtSecret);

    expect(
      getTokenPayload({
        type: 'TOKEN',
        headers: { Authorization: `Bearer ${encryptedToken}` },
        methodArn: 'arn:aws:execute-api:{dummy}'
      }).token
    ).toContain('secret');
  });
});
