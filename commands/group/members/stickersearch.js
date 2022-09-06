const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const axios = require("axios");
const gis = require("g-i-s");
const fs = require("fs");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

module.exports.command = () => {
  return { cmd: ["stickersearch", "ss"], handler: handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Query is not given! \nSend ${prefix}is query`;
    reply(message);
    return;
  }

  let name = args.join(" ");

  gis(name, async (error, results) => {
    if (error) {
      console.log(error);
      reply(error);
    } else {
      //   console.log(JSON.stringify(results, null, "  "));
      let img = results[0]["url"];
      console.log(img);

      let packName = "BOT 🤖";
      let authorName = "pvxcommunity.com";
      stickerMake = new Sticker(img, {
        pack: packName,
        author: authorName,
        type: StickerTypes.FULL,
        quality: 100,
      });

      const stickerFileName = getRandom(".webp");
      await stickerMake.toFile(stickerFileName);

      await sock.sendMessage(
        from,
        {
          sticker: fs.readFileSync(stickerFileName),
        },
        { quoted: msg }
      );
      try {
        fs.unlinkSync(stickerFileName);
      } catch {
        console.log("error in deleting file.");
      }
    }
  });
};
