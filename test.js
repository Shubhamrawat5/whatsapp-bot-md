const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

let commandsAll = {};

async function xyz() {
  let path = "./commands/public/";
  let filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command();
      // console.log(cmdinfo.cmd);
      commandsAll[cmdinfo.cmd] = cmdinfo.handler;
    }
  });

  path = "./commands/group/members/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command();
      // console.log(cmdinfo.cmd);
      commandsAll[cmdinfo.cmd] = cmdinfo.handler;
    }
  });

  path = "./commands/group/admins/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command();
      // console.log(cmdinfo.cmd);
      commandsAll[cmdinfo.cmd] = cmdinfo.handler;
    }
  });
  console.log(commandsAll);
  // commandsAll["help"]();
}
xyz();
