const {
  getDisableCommandData,
  setDisableCommandData,
} = require("../../../db/disableCommandDB");

module.exports.command = () => {
  let cmd = ["disable"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { reply, args } = msgInfoObj;

  if (args.length === 0) {
    await reply("❌ Give command name also by !disable commandName");
    return;
  }
  let cmd = args[0].toLowerCase();

  let res = await getDisableCommandData(from);

  if (res.includes(cmd)) {
    await reply("❌ Already disabled!");
    return;
  }
  res.push(cmd);
  await setDisableCommandData(from, res);

  await reply("✔️ Command disabled!");
};
