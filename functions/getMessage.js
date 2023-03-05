const checkTaggedMessage = async (msg) => {
  if (
    msg.message.extendedTextMessage &&
    msg.message.extendedTextMessage.contextInfo &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation
  ) {
    // simple tagged text message
    return msg.message.extendedTextMessage.contextInfo.quotedMessage
      .conversation;
  } else {
    // tagged message has url, member mentioned
    return msg.message.extendedTextMessage.contextInfo.quotedMessage
      .extendedTextMessage.text;
  }
};

const checkNonTaggedMessage = async (msg) => {
  if (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) {
    // message has url, member mentioned
    return msg.message.extendedTextMessage.text;
  } else {
    // simple text message
    return msg.message.conversation;
  }
};

module.exports.getMessage = async (msg, prefix, command) => {
  let message = "";
  try {
    if (
      msg.message.extendedTextMessage &&
      msg.message.extendedTextMessage.contextInfo &&
      msg.message.extendedTextMessage.contextInfo.quotedMessage
    ) {
      message = await checkTaggedMessage(msg);
    } else {
      message = await checkNonTaggedMessage(msg);
      message = message.replace(prefix, "").replace(command, "").trim();
    }
  } catch (err) {
    console.log(err);
  }

  return message;
};
