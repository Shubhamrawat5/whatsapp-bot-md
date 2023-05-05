const { getGroupLink } = require("../../db/grouplinksDB");

module.exports.command = () => {
  let cmd = ["getlink", "gl"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply } = msgInfoObj;

  const res = await getGroupLink();
  let message = "📛 PVX LINKS 📛";
  res.forEach((group) => {
    message += `\n\n${group.groupjid}\n${group.gname}\n${group.link}`;
  });

  reply(message);
};
