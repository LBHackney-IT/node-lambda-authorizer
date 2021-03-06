const Authorizer = require('../../lib/use-cases/Authorizer');
const jwt = require('jsonwebtoken');

describe('Authorizer', function() {
  it('returns a deny if the request does not have the right secrets', async function() {
    const jwtSecret = 'secret';
    const allowedGroups = ['Friends'];
    const authorizer = Authorizer({
      jwtSecret: jwtSecret,
      allowedGroups: allowedGroups
    });

    const result = await authorizer.execute({
      type: 'TOKEN',
      headers: { Authorization: 'Bearer TOKEN' },
      methodArn: 'arn:aws:execute-api:{dummy}'
    });

    expect(result.policyDocument.Statement).toEqual([
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: 'arn:aws:execute-api:{dummy}'
      }
    ]);
  });

  it('returns a deny if the token does not include the allowed group', async function() {
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

    const result = await authorizer.execute({
      type: 'TOKEN',
      headers: { Authorization: `Bearer ${token}` },
      methodArn: 'arn:aws:execute-api:{dummy}'
    });

    expect(result.policyDocument.Statement).toEqual([
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: 'arn:aws:execute-api:{dummy}'
      }
    ]);
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

    const result = await authorizer.execute({
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

  it('allows a request that satisfies the custom authorisation function', async function() {
    const jwtSecret = 'secret';
    const authorizer = Authorizer({
      jwtSecret: jwtSecret,
      customAuthorize: (decodedToken, authorizerEvent) => {
        try {
          if (authorizerEvent && decodedToken.groups.includes('Friends'))
            return true;
        } catch (err) {
          console.log(err);
        }
        return false;
      }
    });

    const token = jwt.sign(
      { token: 'super-secret-token', groups: ['Friends'] },
      jwtSecret
    );

    const result = await authorizer.execute({
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

  it('allows a request that satisfies the custom authorisation function with no token', async function() {
    const jwtSecret = 'secret';
    const authorizer = Authorizer({
      jwtSecret: jwtSecret,
      customAuthorize: (decodedToken, authorizerEvent) => {
        try {
          if (authorizerEvent && !decodedToken) return true;
        } catch (err) {
          console.log(err);
        }
        return false;
      }
    });

    const result = await authorizer.execute({
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

  it('rejects a request that does not satisfy the custom authorisation function', async function() {
    const jwtSecret = 'secret';
    const authorizer = Authorizer({
      jwtSecret: jwtSecret,
      customAuthorize: (decodedToken, authorizerEvent) => {
        try {
          if (authorizerEvent && decodedToken.groups.includes('Friends'))
            return true;
        } catch (err) {
          console.log(err);
        }
        return false;
      }
    });

    const token = jwt.sign(
      { token: 'super-secret-token', groups: ['Enemies'] },
      jwtSecret
    );

    const result = await authorizer.execute({
      type: 'TOKEN',
      headers: { Authorization: `Bearer ${token}` },
      methodArn: 'arn:aws:execute-api:{dummy}'
    });

    expect(result.policyDocument.Statement).toEqual([
      {
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: 'arn:aws:execute-api:{dummy}'
      }
    ]);
  });
});
