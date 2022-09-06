const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const {
  getDisableCommandData,
  setDisableCommandData,
} = require("../../../db/disableCommandDB");

module.exports.command = () => {
  let cmd = ["disable"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  let cmd = args[0];
  let res = await getDisableCommandData(from);

  if (res.includes(cmd)) {
    reply("❌ Already disabled!");
    return;
  }
  res.push(cmd);
  await setDisableCommandData(from, res);

  reply("✔️ Command disabled!");
};
