const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["broadcast", "bc"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let chats = await sock.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  let groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") 
    .map((v) => {
      return { subject: v.subject, id: v.id };
    });
  // console.log(groups);

  let message = "Broadcast:\n";
  if (
    msg.message.extendedTextMessage &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation
  ) {
    message +=
      msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
  } else {
    message += args.length ? args.join(" ") : "";
  }

  if (msg == "Broadcast:\n") {
    reply("❌ ERROR: EMPTY MESSAGE!");
    return;
  }

  let time = 0;
  groups.forEach((group) => {
    setTimeout(() => {
      sock.sendMessage(group.id, { text: message });
    }, time);
    time += 1000 * 30; //30 sec
  });
};
