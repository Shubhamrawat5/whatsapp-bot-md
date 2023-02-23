const { getGroupLink } = require("../../db/grouplinksDB");

module.exports.command = () => {
  let cmd = ["getlink", "gl"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { reply } = msgInfoObj;

  const res = getGroupLink();
  let message = "PVX LINKS";
  res.forEach((group) => {
    message = `\n\n${group.groupjid}\n${group.name}\n${grouplink}`;
  });

  reply(message);
};
