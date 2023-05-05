const { clearCountWarning } = require("../../db/warningDB");

module.exports.command = () => {
  let cmd = ["warnclear", "clearwarn", "warningclear", "clearwarning"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply, from } = msgInfoObj;

  if (!msg.message.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }
  let mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      let num_split = mentioned[0].split("@s.whatsapp.net")[0];
      await clearCountWarning(mentioned[0], from);
      let warnMsg = `@${num_split} ,Your warnings have been cleared for this group!`;

      await bot.sendMessage(from, {
        text: warnMsg,
        mentions: mentioned,
      });
    } else {
      //if multiple members are tagged
      await reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    let taggedMessageUser = [
      msg.message.extendedTextMessage.contextInfo.participant,
    ];
    let num_split = taggedMessageUser[0].split("@s.whatsapp.net")[0];
    await clearCountWarning(taggedMessageUser[0], from);
    let warnMsg = `@${num_split} ,Your warnings have been cleared for this group!`;
    await bot.sendMessage(from, {
      text: warnMsg,
      mentions: taggedMessageUser,
    });
  }
};
