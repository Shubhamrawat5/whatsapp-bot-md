module.exports.command = () => {
  let cmd = ["delete", "d"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { botNumberJid, reply, isGroupAdmins, isBotGroupAdmins, from } =
    msgInfoObj;

  if (!msg.message.extendedTextMessage) {
    await reply("❌ Tag message to delete.");
    return;
  }

  //bot message, anyone can delete
  if (msg.message.extendedTextMessage.contextInfo.participant == botNumberJid) {
    // await reply("❌ Tag message of bot to delete.");

    //Message with tagged user, links has (.quotedMessage.extendedTextMessage.text), non tagged has (.quotedMessage.conversation)
    const quotedMessage =
      msg.message.extendedTextMessage.contextInfo.quotedMessage;
    if (
      (quotedMessage.extendedTextMessage &&
        quotedMessage.extendedTextMessage.text.includes("Birthday")) ||
      (quotedMessage.extendedTextMessage &&
        quotedMessage.extendedTextMessage.text.includes("Welcome")) ||
      (quotedMessage.conversation &&
        quotedMessage.conversation.includes("📰")) ||
      (quotedMessage.conversation &&
        quotedMessage.conversation.includes("Rank"))
    ) {
      await reply("❌ Cannot delete this message.");
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
  if (!isBotGroupAdmins) {
    await reply("❌ I'm not admin to delete message for everyone.");
    return;
  }

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
    await reply("❌ Only admin can delete member's message.");
  }
};
