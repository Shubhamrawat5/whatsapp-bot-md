module.exports.command = () => {
  let cmd = ["mute"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  await bot.groupSettingUpdate(from, "announcement");
};
