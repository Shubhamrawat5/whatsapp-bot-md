const { getCountWarningAll } = require("../../db/warningDB");

module.exports.command = () => {
  let cmd = ["warnlist", "warninglist"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply, groupName, from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let warnCount = await getCountWarningAll(from);
  let warnMsg = `*${groupName}*\n_warning status_${readMore}\n`;

  warnCount.forEach((mem) => {
    warnMsg += `\n${mem.count} - ${mem.name}`;
  });

  await reply(warnMsg);
};
