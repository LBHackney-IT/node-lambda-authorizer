const extractTokenFromAuthHeader = require('../../lib/use-cases/ExtractTokenFromAuthHeader');

describe('ExtractTokenFromAuthHeader', function() {
  it('retuns null if headers.Authorization not found', async function() {
    const result = extractTokenFromAuthHeader({});

    expect(result).toBe(null);
  });

  it('retuns null when the authirization is not a Bearer token ', async function() {
    const result = extractTokenFromAuthHeader({
      headers: { Authorization: 'THISISNOTABARERTOKEN' }
    });

    expect(result).toBe(null);
  });

  it('retuns the token when the authirization is a Bearer token', async function() {
    const result = extractTokenFromAuthHeader({
      headers: { Authorization: 'Bearer THISISATOKEN1234' }
    });

    expect(result).toBe('THISISATOKEN1234');
  });
});
