const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs-extra");

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  console.log(`Hello ${nameToGreet}!`);
  console.log(JSON.stringify(process.env));
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  fs.readdir(".", console.log);
  console.log(process.cwd());
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
