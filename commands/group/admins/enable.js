const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const {
  getDisableCommandData,
  setDisableCommandData,
} = require("../../../db/disableCommandDB");

module.exports.command = () => {
  let cmd = ["enable"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  let cmd = args[0];
  let res = await getDisableCommandData(from);

  if (!res.includes(cmd)) {
    reply("❌ Already enabled!");
    return;
  }

  resNew = res.filter((c) => {
    return cmd != c;
  });

  await setDisableCommandData(from, resNew);

  reply("✔️ Command enabled!");
};
