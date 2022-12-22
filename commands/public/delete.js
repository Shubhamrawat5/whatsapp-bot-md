const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["delete", "d"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, args, msgInfoObj) => {
  let { botNumberJid, reply, isGroupAdmins } = msgInfoObj;

  if (!msg.message.extendedTextMessage) {
    reply("❌ Tag message to delete.");
    return;
  }

  //bot message, anyone can delete
  if (msg.message.extendedTextMessage.contextInfo.participant == botNumberJid) {
    // reply("❌ Tag message of bot to delete.");

    //check for welcome message,
    //Message with tagged user has (.quotedMessage.extendedTextMessage.text), non tagged has (.quotedMessage.conversation)
    if (
      msg.message.extendedTextMessage.contextInfo.quotedMessage
        .extendedTextMessage &&
      msg.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text.startsWith(
        "Welcome"
      )
    ) {
      reply("❌ Cannot delete a welcome message.");
    } else {
      const options = {
        remoteJid: botNumberJid,
        fromMe: true,
        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
      };
      await bot.sendMessage(from, {
        delete: options,
      });
    }
    return;
  }

  //member message, only admin can delete
  if (isGroupAdmins) {
    const options = {
      remoteJid: from,
      fromMe: false,
      id: msg.message.extendedTextMessage.contextInfo.stanzaId,
      participant: msg.message.extendedTextMessage.contextInfo.participant,
    };
    await bot.sendMessage(from, {
      delete: options,
    });
  } else {
    reply("❌ Only admin can delete member's message.");
  }
};
