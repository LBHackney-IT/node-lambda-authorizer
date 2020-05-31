const Authorizer = require('../../lib/use-cases/Authorizer');
const jwt = require('jsonwebtoken');

describe('Authorizer', function() {
  it('returns "Unauthorized" if the request does not have the right secrets', async function() {
    const jwtSecret = 'secret';
    const allowedGroups = ['Friends'];
    const authorizer = Authorizer({
      jwtSecret: jwtSecret,
      allowedGroups: allowedGroups
    });
    var result = await authorizer.execute({});

    expect(result).toBe('Unauthorized');
  });

  it('returns "not allowed" if the token does not include the allowed group', async function() {
    const jwtSecret = 'secret';
    const allowedGroups = ['Friends'];
    const authorizer = Authorizer({
      jwtSecret: jwtSecret,
      allowedGroups: allowedGroups
    });

    const token = jwt.sign(
      { token: 'super-secret-token', groups: ['Not in the group'] },
      jwtSecret
    );

    var result = await authorizer.execute({
      type: 'TOKEN',
      headers: { Authorization: `Bearer ${token}` },
      methodArn: 'arn:aws:execute-api:{dummy}'
    });

    expect(result).toBe('Not Allowed');
  });

  it('allows a request that have the right secrets', async function() {
    const jwtSecret = 'secret';
    const allowedGroups = ['Friends'];
    const authorizer = Authorizer({
      jwtSecret: jwtSecret,
      allowedGroups: allowedGroups
    });

    const token = jwt.sign(
      { token: 'super-secret-token', groups: ['Friends'] },
      jwtSecret
    );

    var result = await authorizer.execute({
      type: 'TOKEN',
      headers: { Authorization: `Bearer ${token}` },
      methodArn: 'arn:aws:execute-api:{dummy}'
    });

    expect(result.policyDocument.Statement).toEqual([
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: 'arn:aws:execute-api:{dummy}'
      }
    ]);
  });
});
