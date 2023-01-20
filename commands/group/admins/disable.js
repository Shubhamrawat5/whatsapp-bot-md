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

  let cmd = args[0];
  let res = await getDisableCommandData(from);

  if (res.includes(cmd)) {
    await reply("❌ Already disabled!");
    return;
  }
  res.push(cmd);
  await setDisableCommandData(from, res);

  await reply("✔️ Command disabled under 1 min!");
};
