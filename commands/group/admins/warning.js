const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { setCountWarning, getCountWarning } = require("../../../db/warningDB");

module.exports.command = () => {
  let cmd = ["warn", "warning"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupAdmins, isBotGroupAdmins } = msgInfoObj;

  if (!msg.message.extendedTextMessage) {
    sock.sendMessage(from, { text: "❌ Tag someone!" }, { quoted: msg });
    return;
  }
  try {
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
            sock.sendMessage(
              from,
              { text: "❌ I'm not Admin here!" },
              { quoted: msg }
            );

            return;
          }
          if (groupAdmins.includes(mentioned[0])) {
            sock.sendMessage(
              from,
              { text: "❌ Cannot remove admin!" },
              { quoted: msg }
            );

            return;
          }
          await sock.groupParticipantsUpdate(from, mentioned, "remove");
          sock.sendMessage(
            from,
            { text: "_✔ Number removed from group!_" },
            { quoted: msg }
          );
        }
      } else {
        //if multiple members are tagged
        sock.sendMessage(
          from,
          { text: "❌ Mention only 1 member!" },
          { quoted: msg }
        );
      }
    } else {
      //when message is tagged with command
      let taggedMessageUser = [
        msg.message.extendedTextMessage.contextInfo.participant,
      ];
      let warnCount = await getCountWarning(taggedMessageUser[0], from);
      let num_split = taggedMessageUser[0].split("@s.whatsapp.net")[0];
      let warnMsg = `@${num_split} ,Your have been warned. Warning status (${
        warnCount + 1
      }/3). Don't repeat this type of behaviour again or you'll be banned from group!`;

      await sock.sendMessage(from, {
        text: warnMsg,
        mentions: taggedMessageUser,
      });
      await setCountWarning(taggedMessageUser[0], from);
      if (warnCount >= 2) {
        if (!isBotGroupAdmins) {
          sock.sendMessage(
            from,
            { text: "❌ I'm not Admin here!" },
            { quoted: msg }
          );
          return;
        }
        if (groupAdmins.includes(taggedMessageUser[0])) {
          sock.sendMessage(
            from,
            { text: "❌ Cannot remove admin!" },
            { quoted: msg }
          );
          return;
        }
        await sock.groupParticipantsUpdate(from, taggedMessageUser, "remove");
        sock.sendMessage(
          from,
          { text: "_✔ Number removed from group!_" },
          { quoted: msg }
        );
      }
    }
  } catch (err) {
    console.log(err);
    sock.sendMessage(
      from,
      { text: `❌ There is some problem.` },
      { quoted: msg }
    );
  }
};
