module.exports.command = () => {
  let cmd = ["block"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  const { reply } = msgInfoObj;
  let text = `*─「 <{PVX}> BOT 」 ─*

_- Give command name (with comma seperated and without spaces) to be blocked in *first line of group description* , like:_
score,add,quote

_- If cricket matchId is also to be added in description, then always give matchId in starting, like:_
82621,score,add,only91,quote`;

  await reply(text);
};
