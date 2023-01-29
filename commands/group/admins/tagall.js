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
    message +=
      msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation +
      "\n\n";
  } else {
    message += args.length ? args.join(" ") + "\n\n" : "";
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
