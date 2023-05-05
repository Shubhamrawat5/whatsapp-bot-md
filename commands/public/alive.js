module.exports.command = () => {
  let cmd = ["alive", "a"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  const { reply } = msgInfoObj;
  let text = `*─「 <{PVX}> BOT 」 ─*\n\nYES! BOT IS ALIVE !!!`;

  await reply(text);
};
