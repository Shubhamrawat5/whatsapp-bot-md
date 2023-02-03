module.exports.command = () => {
  let cmd = ["tagall", "hiddentagall", "tagallhidden"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { groupMembers, args, command } = msgInfoObj;
  //if (
  //  groupName.toUpperCase().includes("PVX") &&
  //  ![myNumber + "@s.whatsapp.net", botNumberJid].includes(sender)
  //) {
  //  await reply(`❌ Owner only command for avoiding spam in PVX Groups!`);
  //  return;
  //}

  let jids = [];
  let message = "ALL: ";
  if (
    msg.message.extendedTextMessage &&
    msg.message.extendedTextMessage.contextInfo &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation
  ) {
    //quoted message
    message +=
      msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation +
      "\n\n";
  } else {
    //not a quoted message
    let body;
    if (
      msg.message.extendedTextMessage &&
      msg.message.extendedTextMessage.text
    ) {
      // message has url, member mentioned
      body = msg.message.extendedTextMessage.text;
    } else {
      // simple text message
      body = msg.message.conversation;
    }
    if (command === "tagall" || command === "hiddentagall")
      body = body.slice(body.search("tagall") + 7);
    else body = body.slice(body.search("tagallhidden") + 13);

    message += body + "\n\n";
    // message += args.length ? args.join(" ") + "\n\n" : "";
  }

  for (let member of groupMembers) {
    if (command === "tagall") message += "@" + member.id.split("@")[0] + " ";
    jids.push(member.id);
  }

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};
