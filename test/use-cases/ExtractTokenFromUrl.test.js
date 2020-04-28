const extractTokenFromUrl = require('../../lib/use-cases/ExtractTokenFromUrl');

describe('ExtractTokenFromAuthUrl', function() {
  it('retuns null if authToken not found in query parameters', async function() {
    const result = extractTokenFromUrl({});

    expect(result).toBe(null);
  });

  it('retuns the token when the authirization is the query parameters', async function() {
    const result = extractTokenFromUrl({
      queryStringParameters: { authToken: 'THISISATOKEN1234' }
    });

    expect(result).toBe('THISISATOKEN1234');
  });
});
