const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { setCountWarning, getCountWarning } = require("../../../db/warningDB");

module.exports.command = () => {
  let cmd = ["warn", "warning"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupAdmins, isBotGroupAdmins, reply } = msgInfoObj;

  if (!msg.message.extendedTextMessage) {
    reply("❌ Tag someone!");
    return;
  }
  let mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
  if (mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      let warnCount = await getCountWarning(mentioned[0], from);
      let num_split = mentioned[0].split("@s.whatsapp.net")[0];
      let warnMsg = `@${num_split} ,You have been warned. Warning status (${
        warnCount + 1
      }/3). Don't repeat this type of behaviour again or you'll be banned from the group!`;

      await sock.sendMessage(from, {
        text: warnMsg,
        mentions: mentioned,
      });
      await setCountWarning(mentioned[0], from);
      if (warnCount >= 2) {
        if (!isBotGroupAdmins) {
          reply("❌ I'm not Admin here!");

          return;
        }
        if (groupAdmins.includes(mentioned[0])) {
          reply("❌ Cannot remove admin!");

          return;
        }
        await sock.groupParticipantsUpdate(from, mentioned, "remove");
        reply("_✔ Number removed from group!_");
      }
    } else {
      //if multiple members are tagged
      reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    let taggedMessageUser = [
      msg.message.extendedTextMessage.contextInfo.participant,
    ];
    let warnCount = await getCountWarning(taggedMessageUser[0], from);
    let num_split = taggedMessageUser[0].split("@s.whatsapp.net")[0];
    let warnMsg = `@${num_split} ,You have been warned. Warning status (${
      warnCount + 1
    }/3). Don't repeat this type of behaviour again or you'll be banned from group!`;

    await sock.sendMessage(from, {
      text: warnMsg,
      mentions: taggedMessageUser,
    });
    await setCountWarning(taggedMessageUser[0], from);
    if (warnCount >= 2) {
      if (!isBotGroupAdmins) {
        reply("❌ I'm not Admin here!");
        return;
      }
      if (groupAdmins.includes(taggedMessageUser[0])) {
        reply("❌ Cannot remove admin!");
        return;
      }
      await sock.groupParticipantsUpdate(from, taggedMessageUser, "remove");
      reply("_✔ Number removed from group!_");
    }
  }
};
