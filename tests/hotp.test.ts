import test from 'ava';
import * as otpts from 'otpts';
import { generateHotpToken } from '../src/cmd';
const debug = require('debug')('otplib-cli:tests');

test('hotp works with sample secrets and counter 0', async (t) => {
  const secrets = ['12345678901234567890'];
  const promises = secrets.map((secret) => {
    return Promise.resolve().then(() => {
      const hotp = otpts.buildHotp({
        secret: Buffer.from(secret, 'ascii'),
      });

      const expectedToken = hotp.generate(0);
      const actualToken = generateHotpToken({ secret, counter: 0 });

      return {
        secret,
        expected: expectedToken,
        actual: actualToken,
      };
    });
  });

  const results = await Promise.all(promises);
  for (const result of results) {
    t.is(result.actual, result.expected, `Failed with secret ${result.secret}`);
  }
});

test('hotp works with sample secrets and many counter values', async (t) => {
  const secrets = ['12345678901234567890'];
  const promises = secrets.map((secret) => {
    const innerPromises: Promise<{
      secret: string;
      counter: number;
      expected: string;
      actual: string;
    }>[] = [];

    for (let i = 0; i < 100; i++) {
      innerPromises.push(
        Promise.resolve(i).then((counter) => {
          const totp = otpts.buildHotp({
            secret: Buffer.from(secret, 'ascii'),
          });
          const expectedToken = totp.generate(counter);
          const actualToken = generateHotpToken({ secret, counter });
          return {
            secret,
            counter,
            expected: expectedToken,
            actual: actualToken,
          };
        }),
      );
    }

    return Promise.all(innerPromises);
  });

  const results = await Promise.all(promises);
  const flatenResults = results.reduce((acc, curr) => {
    return acc.concat(curr);
  }, []);
  for (const result of flatenResults) {
    // console.log(JSON.stringify(result));
    // console.log(result.secret);
    t.is(
      result.actual,
      result.expected,
      `Failed with secret ${result.secret} and counter ${result.counter}`,
    );
  }
});
