#!/usr/bin/env node
const debug = require('debug')('otplib-cli');
import cmd from './cmd';

if (require.main === module) {
  cmd();
}
