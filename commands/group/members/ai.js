const importDynamic = new Function("modulePath", "return import(modulePath)");
require("dotenv").config();
let api;
let isApiSetup = false;

module.exports.command = () => {
  return { cmd: ["chatgpt", "ai"], handler: handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args, groupName } = msgInfoObj;
  //   if (!groupName.toUpperCase().includes("PVX")) {
  //     await reply(
  //       `❌ COMMAND ONLY FOR PVX GROUPS!\nREASON: There is a limit with the openapi's free api`
  //     );
  //     return;
  //   }

  try {
    if (!isApiSetup) {
      const { ChatGPTAPI } = await importDynamic("chatgpt");
      api = new ChatGPTAPI({
        apiKey: process.env.OPENAPI,
      });
      isApiSetup = true;
    }

    if (args.length === 0) {
      await reply(`❌ Query is not given! \nSend ${prefix}ai query`);
      return;
    }

    let query = args.join(" ");
    const res = await api.sendMessage(query);
    reply(res.text);
  } catch (err) {
    console.log(err);
    reply(err.toString());
  }
};
