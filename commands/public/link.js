module.exports.command = () => {
  let cmd = ["link", "pvx", "pvxlink", "pvxlinks"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let text =
    "*─「 🔥 JOIN <{PVX}> FAMILY 🔥 」─*\n\n>> https://pvxcommunity.com <<";

  await bot.sendMessage(from, { text }, { quoted: msg, detectLinks: true });
};
