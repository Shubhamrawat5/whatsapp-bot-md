module.exports.command = () => {
  let cmd = ["remove", "ban", "kick"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { groupAdmins, isBotGroupAdmins, reply, from } = msgInfoObj;

  if (!isBotGroupAdmins) {
    await reply("❌ I'm not Admin here!");
    return;
  }

  if (!msg.message.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }

  // console.log(msg);
  /*
      1) when !ban OR !ban xyz
         message:{ conversation: '!ban' }
      2) when !ban tagMember
          message: Message {
            extendedTextMessage: ExtendedTextMessage {
              text: '.ban @91745cccccc',
              previewType: 0,
              contextInfo: [ContextInfo],
              inviteLinkGroupType: 0
           }
         }

      3) when !ban tagMessage
          message: {
              extendedTextMessage: {
                text: '.ban',
                previewType: 'NONE',
                contextInfo: [Object],
                inviteLinkGroupType: 'DEFAULT'
             }
          }
  */

  let mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      if (groupAdmins.includes(mentioned[0])) {
        //if admin then don't remove
        await reply("❌ Cannot remove admin!");
        return;
      }
      const response = await bot.groupParticipantsUpdate(
        from,
        mentioned,
        "remove"
      );
      if (response[0].status === "200")
        await reply("_✔ Number removed from group!_");
      else await reply("_❌ There is some problem!_");
    } else {
      //if multiple members are tagged
      await reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    let taggedMessageUser = [
      msg.message.extendedTextMessage.contextInfo.participant,
    ];
    if (groupAdmins.includes(taggedMessageUser[0])) {
      //if admin then don't remove
      await reply("❌ Cannot remove admin!");
      return;
    }
    const response = await bot.groupParticipantsUpdate(
      from,
      taggedMessageUser,
      "remove"
    );
    if (response[0].status === "200")
      await reply("_✔ Number removed from group!_");
    else await reply("_❌ There is some problem!_");
  }
};
