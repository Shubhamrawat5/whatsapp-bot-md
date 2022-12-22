const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["unmute"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;

  await bot.groupSettingUpdate(from, "not_announcement");
};
