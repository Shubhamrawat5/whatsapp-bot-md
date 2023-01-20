const gis = require("g-i-s");
const fs = require("fs");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

module.exports.command = () => {
  return { cmd: ["stickersearch", "ss"], handler: handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Query is not given! \nSend ${prefix}is query`;
    await reply(message);
    return;
  }

  let name = args.join(" ");

  gis(name, async (error, results) => {
    if (error) {
      console.log(error);
      await reply(error);
    } else {
      try {
        let index = 0;
        if (results.length >= 10) {
          index = Math.floor(Math.random() * 10);
        }
        let img = results[index]["url"];
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

        await bot.sendMessage(
          from,
          {
            sticker: fs.readFileSync(stickerFileName),
          },
          { quoted: msg }
        );
      } catch (err) {
        await reply("❌ Error in search!");
      }
      try {
        fs.unlinkSync(stickerFileName);
      } catch {
        console.log("error in deleting file.");
      }
    }
  });
};
