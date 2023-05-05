module.exports.command = () => {
  return { cmd: ["movie"], handler: handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply } = msgInfoObj;

  const text = `📛 Join PVX TG group:\n\nhttps://t.me/joinchat/J7FzKB1uYt0xNDVl`;
  reply(text);
};
