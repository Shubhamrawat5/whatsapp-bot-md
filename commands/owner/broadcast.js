module.exports.command = () => {
  let cmd = ["broadcast", "bc"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply, args } = msgInfoObj;
  let chats = await bot.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  let groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us"))
    .map((v) => {
      return { subject: v.subject, id: v.id };
    });
  //  && v.subject.startsWith("<{PVX}>")
  // console.log(groups);

  let message = "Broadcast:\n";
  if (
    msg.message.extendedTextMessage &&
    msg.message.extendedTextMessage.contextInfo &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage
  ) {
    console.log("true");
    if (msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation)
      message +=
        msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
    else
      message +=
        msg.message.extendedTextMessage.contextInfo.quotedMessage
          .extendedTextMessage.text;
  } else {
    message += args.length ? args.join(" ") : "";
  }

  console.log(message == "Broadcast:\n");
  if (message == "Broadcast:\n") {
    await reply("❌ ERROR: EMPTY MESSAGE!");
    return;
  }

  let time = 0;
  await reply("Broadcasting...");
  groups.forEach((group) => {
    setTimeout(async () => {
      await bot.sendMessage(group.id, { text: message, detectLinks: true });
    }, time);
    time += 1000 * 30; //30 sec
  });
};
