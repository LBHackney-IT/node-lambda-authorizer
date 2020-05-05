const extractTokenFromCookieHeader = require('../../lib/use-cases/ExtractTokenFromCookieHeader');

describe('ExtractTokenFromCookieHeader', function() {
  it('returns null if headers.Authorization not found', async function() {
    const result = extractTokenFromCookieHeader({});

    expect(result).toBe(null);
  });

  it('returns the token when hackney token exists in the cookies', async function() {
    const result = extractTokenFromCookieHeader({
      headers: { Cookie: 'hackneyToken=THISISATOKEN1234' }
    });

    expect(result).toBe('THISISATOKEN1234');
  });

  it('can find the cookie case-insensitive', async function() {
    const result = extractTokenFromCookieHeader({
      headers: { cookie: 'hackneyToken=THISISATOKEN1234' }
    });

    expect(result).toBe('THISISATOKEN1234');
  });
});
