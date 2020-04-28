const extractTokenFromCookieHeader = require("../../lib/use-cases/ExtractTokenFromCookieHeader");

describe("ExtractTokenFromCookieHeader", function() {
  it("retuns null if headers.Authorization not found", async function() {
    const result = extractTokenFromCookieHeader({});

    expect(result).toBe(null);
  });

  it("retuns the token when hackney token exists in the cookies", async function() {
    const result = extractTokenFromCookieHeader({
      headers: { Cookie: "hackneyToken=THISISATOKEN1234" }
    });

    expect(result).toBe("THISISATOKEN1234");
  });
});
