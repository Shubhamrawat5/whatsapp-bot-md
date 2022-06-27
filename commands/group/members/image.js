const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["image", "toimg"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, isMedia, isTaggedSticker } = msgInfoObj;

  if ((isMedia && !msg.message.stickerMessage.isAnimated) || isTaggedSticker) {
    let downloadFilePath;
    if (msg.message.stickerMessage) {
      downloadFilePath = msg.message.stickerMessage;
    } else {
      downloadFilePath =
        msg.message.extendedTextMessage.contextInfo.quotedMessage
          .stickerMessage;
    }
    const stream = await downloadContentFromMessage(downloadFilePath, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    const media = getRandom(".jpeg");
    await writeFile(media, buffer);
    ffmpeg(`./${media}`)
      .fromFormat("webp_pipe")
      .save("result.png")
      .on("error", (err) => {
        console.log(err);
        sock.sendMessage(
          from,
          {
            text: "❌ There is some problem!\nOnly non-animated stickers can be convert to image!",
          },
          { quoted: msg }
        );
      })
      .on("end", () => {
        sock.sendMessage(
          from,
          {
            image: fs.readFileSync("result.png"),
          },
          {
            mimetype: "image/png",
            quoted: msg,
          }
        );
        try {
          fs.unlinkSync(media);
          fs.unlinkSync("result.png");
        } catch (err) {
          console.log(err);
        }
      });
  } else {
    sock.sendMessage(
      from,
      {
        text: "❌ There is some problem!\nOnly non-animated stickers can be convert to image!",
      },
      { quoted: msg }
    );
  }
};
