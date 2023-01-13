const { downloadContentFromMessage } = require("@adiwajshing/baileys");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { LoggerBot } = require("./loggerBot");

const pvxstickeronly1 = "919557666582-1628610549@g.us";
const pvxstickeronly2 = "919557666582-1586018947@g.us";
let countSent = 1;

module.exports.forwardSticker = async (bot, msg) => {
  try {
    let downloadFilePath = msg.message.stickerMessage;
    const stream = await downloadContentFromMessage(
      downloadFilePath,
      "sticker"
    );
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const sticker = new Sticker(buffer, {
      pack: "BOT 🤖",
      author: "pvxcommunity.com",
      type: StickerTypes.DEFAULT,
      quality: 80,
    });

    await bot.sendMessage(pvxstickeronly1, await sticker.toMessage(), {
      ephemeralExpiration: 86400,
    });
    await bot.sendMessage(pvxstickeronly2, await sticker.toMessage(), {
      ephemeralExpiration: 86400,
    });

    console.log(`${countSent} sticker sent!`);
    countSent += 1;
  } catch (err) {
    await LoggerBot(false, "FORWARD-STICKER", err, msg);
  }
};
