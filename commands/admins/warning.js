const { setCountWarning, getCountWarning } = require("../../db/warningDB");

module.exports.command = () => {
  let cmd = ["warn", "warning"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { groupAdmins, isBotGroupAdmins, reply, from } = msgInfoObj;

  if (!msg.message.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }
  let mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      let warnCount = await getCountWarning(mentioned[0], from);
      let num_split = mentioned[0].split("@s.whatsapp.net")[0];

      if (warnCount < 3) {
        //0,1,2
        warnCount = await setCountWarning(mentioned[0], from);
      }
      let warnMsg = `@${num_split} ,You have been warned. Warning status: (${warnCount}/3). Don't repeat this type of behaviour again or you'll be banned from the group!`;

      await bot.sendMessage(from, {
        text: warnMsg,
        mentions: mentioned,
      });
      if (warnCount >= 3) {
        //on 3rd warning
        if (!isBotGroupAdmins) {
          await reply("❌ I'm not Admin here!");

          return;
        }
        if (groupAdmins.includes(mentioned[0])) {
          await reply("❌ Cannot remove admin!");

          return;
        }
        await bot.groupParticipantsUpdate(from, mentioned, "remove");
        await reply("_✔ Number removed from group!_");
      }
    } else {
      //if multiple members are tagged
      await reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    let taggedMessageUser = [
      msg.message.extendedTextMessage.contextInfo.participant,
    ];
    let warnCount = await getCountWarning(taggedMessageUser[0], from);
    let num_split = taggedMessageUser[0].split("@s.whatsapp.net")[0];

    if (warnCount < 3) {
      //0,1,2
      warnCount = await setCountWarning(taggedMessageUser[0], from);
    }
    let warnMsg = `@${num_split} ,You have been warned. Warning status (${warnCount}/3). Don't repeat this type of behaviour again or you'll be banned from group!`;

    await bot.sendMessage(from, {
      text: warnMsg,
      mentions: taggedMessageUser,
    });
    if (warnCount >= 3) {
      //on 3rd warning
      if (!isBotGroupAdmins) {
        await reply("❌ I'm not Admin here!");
        return;
      }
      if (groupAdmins.includes(taggedMessageUser[0])) {
        await reply("❌ Cannot remove admin!");
        return;
      }
      await bot.groupParticipantsUpdate(from, taggedMessageUser, "remove");
      await reply("_✔ Number removed from group!_");
    }
  }
};
