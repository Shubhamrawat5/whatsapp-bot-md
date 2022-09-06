const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const axios = require("axios");
const gis = require("g-i-s");

module.exports.command = () => {
  return { cmd: ["imagesearchs", "is"], handler: handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Query is not given! \nSend ${prefix}is query`;
    reply(message);
    return;
  }

  let name = args[0];

  gis(name, (error, results) => {
    console.log(1);
    if (error) {
      console.log(error);
      reply(error);
    } else {
      //   console.log(JSON.stringify(results, null, "  "));
      let img = results[0]["url"];
      console.log(img);
      sock.sendMessage(
        from,
        {
          image: img,
        },
        {
          mimetype: "image/png",
          quoted: msg,
        }
      );
    }
  });
};
