import test from 'ava';
import yargs from 'yargs';
import { buildTopLevelParser } from '../src/cmd';
const debug = require('debug')('otplib-cli:tests');

test('yargs shows help if invoked with help option', async (t) => {
  const parser = buildTopLevelParser(yargs);
  parser.parse(['-h'], (err, argv, output) => {
    // debug(err);
    // debug(argv);
    // debug(output);
    t.truthy(output);
  });
});
