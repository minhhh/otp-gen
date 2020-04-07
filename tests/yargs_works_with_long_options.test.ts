import test from "ava";
const debug = require("debug")("otplib-cli:tests");

test("yargs works with long options", async (t) => {
  require("yargs")
    .option("mode", {
      alias: "m",
      describe: "Choose a mode (hotp | totp)",
      default: "totp",
      choices: ["totp", "hotp"],
    })
    .parse(["--mode", "hotp"], (err, argv, output) => {
      // debug(JSON.stringify(argv))
      t.truthy(argv);
      t.is(argv.mode, "hotp");
    });
});
