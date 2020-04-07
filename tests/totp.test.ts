import test from 'ava';
import * as otpts from 'otpts';
import { generateTotpToken } from '../src/cmd';
const debug = require('debug')('otplib-cli:tests');

test('totp works with sample secrets', async (t) => {
  const secrets = ['JBSWY3DPEHPK3PXP', 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ'];
  const promises = secrets.map((secret) => {
    const totp = otpts.buildTotp({
      secret: otpts.base32Decode(secret),
    });

    const expectedToken = totp.generate();
    const actualToken = generateTotpToken({ secret });

    return Promise.resolve({
      secret,
      expected: expectedToken,
      actual: actualToken,
    });
  });

  const results = await Promise.all(promises);
  for (const result of results) {
    t.is(result.actual, result.expected, `Failed with secret ${result.secret}`);
  }
});
