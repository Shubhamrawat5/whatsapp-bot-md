module.exports.command = () => {
  let cmd = ["feedback"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  const { reply } = msgInfoObj;

  let text = `✔ Give any Feedback related to PVX\nhttps://forms.gle/WEQ33xzHpYAQvArd6`;

  await reply(text);
};
