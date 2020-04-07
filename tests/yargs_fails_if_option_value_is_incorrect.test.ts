import test from "ava";
const debug = require("debug")("otplib-cli:tests");

test("yargs fails if option value is incorrect", async (t) => {
  require("yargs")
    .option("mode", {
      alias: "m",
      describe: "Choose a mode (hotp | totp)",
      default: "totp",
      choices: ["totp", "hotp"],
    })
    .parse(["--mode", "incorrect"], (err, argv, output) => {
      // debug(JSON.stringify(err));
      // debug(output);
      t.truthy(err);
    });
});
