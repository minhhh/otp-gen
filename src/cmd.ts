const debug = require('debug')('otplib-cli:cmd');
import yargs from 'yargs';
import { hotp, authenticator } from 'otplib';
import { KeyEncodings, HashAlgorithms } from '@otplib/core';

const cmd = () => {
  const parser = buildTopLevelParser(yargs);
  parser.parse(process.argv.slice(2), (err: string, argv, output: string) => {
    main(parser, err, argv, output);
  });
};

const buildTopLevelParser = (y: yargs.Argv<{}>) => {
  return y
    .version()
    .command('*', '', (builder) => {
      builder
        .usage(INFO.description)
        .epilog(INFO.epilog)
        .option('mode', {
          alias: 'm',
          describe: 'Choose a mode',
          default: 'totp',
          choices: [MODE.totp, MODE.hotp],
          type: 'string',
        })
        .option('epoch', {
          describe: 'Starting time since UNIX epoch [default: Date.now()]',
          default: Date.now(),
          type: 'number',
        })
        .option('step', {
          describe: 'Time step (seconds)',
          default: 30,
          type: 'number',
        })
        .option('counter', {
          describe: 'Counter for HOTP',
          default: 0,
          type: 'number',
        })
        .positional('token', {
          describe: 'The otp secret',
          type: 'string',
        })
        .demandCommand();
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
    })
    .help('h')
    .alias('h', 'help')
    .wrap(80);
};

const main = (
  parser: yargs.Argv,
  err: string,
  argv: {
    [x: string]: unknown;
    verbose: boolean;
    _: string[];
    $0: string;
  },
  output: string,
) => {
  const handled = handleHelpMessage(parser, err, argv, output);
  if (handled.handled) {
    process.exit(handled.exitCode);
  }
  if (argv.m === MODE.totp) {
    const epoch: number = Number(argv.epoch);
    const secret: string = argv._[0];
    const step: number = Number(argv.step);

    console.log(generateTotpToken({ epoch, secret, step }));
  } else if (argv.m === MODE.hotp) {
    debug('mode hotp starts');
    const counter: number = Number(argv.counter);
    const secret: string = argv._[0];

    console.log(generateHotpToken({ secret, counter }));
  }
};

const generateTotpToken = ({
  secret,
  epoch = Date.now(),
  step = 30,
}: {
  secret: string;
  epoch?: number;
  step?: number;
}): string => {
  authenticator.options = {
    epoch,
    step,
    encoding: KeyEncodings.HEX,
    algorithm: HashAlgorithms.SHA1,
  };
  return authenticator.generate(secret);
};

const generateHotpToken = ({
  secret,
  counter,
}: {
  secret: string;
  counter: number;
}): string => {
  debug('generateHotpToken starts');
  hotp.options = {
    encoding: KeyEncodings.ASCII,
    algorithm: HashAlgorithms.SHA1,
  };
  return hotp.generate(secret, counter);
};

const handleHelpMessage = (
  parser: yargs.Argv,
  err: string,
  argv: {
    [x: string]: unknown;
    verbose: boolean;
    _: string[];
    $0: string;
  },
  output: string,
): { exitCode: number; handled: boolean } => {
  let errorMessage = INFO.defaultErrorMessage;
  let handled = false;
  let exitCode = 0;
  debug(JSON.stringify(argv));
  debug(err);
  debug(output);
  if (err) {
    if (argv._.length === 0) {
      errorMessage = INFO.errorMessages.missingSecret.concat(
        '\n',
        errorMessage,
      );
    } else {
      errorMessage = output;
    }
    handled = true;
    exitCode = 1;
    // } else if (argv.m === MODE.hotp) {
    //   errorMessage = INFO.errorMessages.hotpNotImplemented.concat(
    //     '\n',
    //     errorMessage,
    //   );
    //   handled = true;
    //   exitCode = 1;
  } else if (argv.h || argv.version) {
    console.log(output);
    handled = true;
    exitCode = 0;
  }

  if (exitCode > 0) {
    console.error(errorMessage);
  }
  return { handled, exitCode };
};

const INFO = {
  description: `Command line One Time Password (OTP) generator

  otp-gen [options] <secret>`,
  epilog: `For more information, please see the code.
  `,
  errorMessages: {
    missingSecret: '<secret> is missing!',
    hotpNotImplemented: 'HOTP is not implemented yet',
  },
  defaultErrorMessage: 'Try calling with --help for usage instructions',
};

const MODE = {
  totp: 'totp',
  hotp: 'hotp',
};

export default cmd;
export { INFO, buildTopLevelParser, generateTotpToken, generateHotpToken };
