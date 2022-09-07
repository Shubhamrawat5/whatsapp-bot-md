const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const axios = require("axios");
const gis = require("g-i-s");

module.exports.command = () => {
  return { cmd: ["imagesearch", "is"], handler: handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Query is not given! \nSend ${prefix}is query`;
    reply(message);
    return;
  }

  let name = args.join(" ");

  gis(name, (error, results) => {
    if (error) {
      console.log(error);
      reply(error);
    } else {
      //   console.log(JSON.stringify(results, null, "  "));
      let index = 0;
      if (results.length >= 10) {
        index = Math.floor(Math.random() * 10);
      }
      let img = results[index]["url"];
      console.log(img);

      try {
        sock.sendMessage(
          from,
          {
            image: { url: img },
          },
          {
            mimetype: "image/png",
            quoted: msg,
          }
        );
      } catch (err) {
        reply("❌ Error in search!");
      }
    }
  });
};
