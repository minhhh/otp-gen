# otp-gen

Docker command-line client to generate HOTP and TOTP tokens.

## Usage

Command-line usage with docker installed

    Command line One Time Password (OTP) generator

    docker run -rm minhhh/otp-gen [options] <secret>

    Positionals:
      token  The otp secret                                                 [string]

    Options:
      --version      Show version number                                   [boolean]
      --verbose, -v  Run with verbose logging                              [boolean]
      -h, --help     Show help                                             [boolean]
      --mode, -m     Choose a mode
                                [string] [choices: "totp", "hotp"] [default: "totp"]
      --epoch        Starting time since UNIX epoch [default: Date.now()]
                                                                            [number]
      --step         Time step (seconds)                      [number] [default: 30]
      --counter      Counter for HOTP                          [number] [default: 0]

    For more information, please see the code.

Examples

    # Generate TOTP
    docker run --rm minhhh/otp-gen JBSWY3DPEHPK3PXP

    # Generate TOTP with epoch
    docker run --rm minhhh/otp-gen --epoch 0 JBSWY3DPEHPK3PXP

    # Generate HOTP with counter
    docker run --rm minhhh/otp-gen -m hotp --counter 0 12345678901234567890

## Licence

MIT, see LICENSE.
