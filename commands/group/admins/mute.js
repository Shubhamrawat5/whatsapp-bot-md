const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["mute"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;

  await bot.groupSettingUpdate(from, "announcement");
};
