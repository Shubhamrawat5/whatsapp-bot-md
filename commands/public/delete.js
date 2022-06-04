const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["delete", "d"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { botNumberJid } = msgInfoObj;
  try {
    if (
      !msg.message.extendedTextMessage ||
      !(msg.message.extendedTextMessage.contextInfo.participant == botNumberJid)
    ) {
      await sock.sendMessage(
        from,
        {
          text: "❌ Tag message of bot to delete.",
        },
        { quoted: msg }
      );
      return;
    }

    const options = {
      remoteJid: botNumberJid,
      fromMe: true,
      id: msg.message.extendedTextMessage.contextInfo.stanzaId,
    };
    await sock.sendMessage(from, {
      delete: options,
    });
  } catch (err) {
    console.log(err);
    await sock.sendMessage(
      from,
      {
        text: "❌ There is some problem!",
      },
      { quoted: msg }
    );
  }
};
