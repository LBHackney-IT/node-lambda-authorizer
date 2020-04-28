const userInAllowedGroup = require('../../lib/use-cases/UserInAllowedGroup');

describe('userInAllowedGroup', function() {
  it('retuns false if user is not in the allowed group', async function() {
    const result = userInAllowedGroup(['not allowed'], ['allowed', 'group']);

    expect(result).toBe(false);
  });

  it('returns false if the groups are empty', async function() {
    const result = userInAllowedGroup([], []);

    expect(result).toBe(false);
  });

  it('retuns true if user is in the allowed group', async function() {
    const result = userInAllowedGroup(['allowed'], ['allowed', 'group']);

    expect(result).toBe(true);
  });
});
