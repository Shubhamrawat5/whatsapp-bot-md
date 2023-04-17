const axios = require("axios");

module.exports.command = () => {
  return { cmd: ["fb", "facebook"], handler: handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, args, reply } = msgInfoObj;
  if (args.length === 0) {
    reply(`❌ URL is empty! \nSend ${prefix}fb url`);
    return;
  }

  let urlFb = args[0];
  console.log(urlFb);

  let res = await axios.get(
    "https://fantox001-scrappy-api.vercel.app/fbdl?url=" + urlFb
  );

  bot.sendMessage(
    from,
    {
      video: { url: res.data.videoUrl },
    },
    { quoted: msg }
  );
};
