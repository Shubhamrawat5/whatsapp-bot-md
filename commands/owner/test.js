const { MessageType, Mimetype } = require("@adiwajshing/baileys");
module.exports.command = () => {
  let cmd = ["test"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;
  try {
    if (args.length === 0) {
      reply(`❌ empty query!`);
      return;
    }
    let resultTest = eval(args[0]);
    if (typeof resultTest === "object") reply(JSON.stringify(resultTest));
    else reply(resultTest.toString());
  } catch (err) {
    reply(err.toString());
  }
};
