const axios = require("axios");

module.exports.command = () => {
  return { cmd: ["fb", "facebook"], handler: handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { prefix, args, reply, from } = msgInfoObj;
  if (args.length === 0) {
    reply(`❌ URL is empty! \nSend ${prefix}fb url`);
    return;
  }

  let urlFb = args[0];
  console.log(urlFb);

  try {
    let res = await axios.get(
      "https://fantox001-scrappy-api.vercel.app/fbdl?url=" + urlFb
    );

    bot.sendMessage(
      from,
      {
        video: { url: res.data.videoUrl },
      },
      { quoted: msg, mediaUploadTimeoutMs: 1000 * 30 }
    );
  } catch (err) {
    reply(
      `${err.toString()}\n\nNote: only public fb videos can be downloaded!`
    );
  }
};
