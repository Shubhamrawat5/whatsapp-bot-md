const {
  getDisableCommandData,
  setDisableCommandData,
} = require("../../../db/disableCommandDB");

module.exports.command = () => {
  let cmd = ["enable"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { reply, args } = msgInfoObj;

  let cmd = args[0];
  let res = await getDisableCommandData(from);

  if (!res.includes(cmd)) {
    await reply("❌ Already enabled!");
    return;
  }

  resNew = res.filter((c) => {
    return cmd != c;
  });

  await setDisableCommandData(from, resNew);

  await reply("✔️ Command enabled under 1 min!");
};
