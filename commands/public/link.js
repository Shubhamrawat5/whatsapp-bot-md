module.exports.command = () => {
  let cmd = ["link", "pvx", "pvxlink"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { from } = msgInfoObj;

  let text =
    "*─「 🔥 JOIN <{PVX}> FAMILY 🔥 」─*\n\n>> https://pvxcommunity.com <<";

  await bot.sendMessage(from, { text }, { quoted: msg, detectLinks: true });
};
