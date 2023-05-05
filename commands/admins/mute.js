module.exports.command = () => {
  let cmd = ["mute"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { from } = msgInfoObj;

  await bot.groupSettingUpdate(from, "announcement");
};
