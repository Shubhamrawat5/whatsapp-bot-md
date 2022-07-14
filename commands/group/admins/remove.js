const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["remove", "ban", "kick"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, groupAdmins, isBotGroupAdmins, reply } = msgInfoObj;

  if (!isBotGroupAdmins) {
    reply("❌ I'm not Admin here!");
    return;
  }

  if (!msg.message.extendedTextMessage) {
    reply("❌ Tag someone!");
    return;
  }

  // console.log(msg);
  /*
      1) when !ban OR !ban xyz
         message:{ conversation: '!ban' }
      2) when !ban tagMember
          message: Message {
            extendedTextMessage: ExtendedTextMessage {
              text: '.ban @917454921062',
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
  if (mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      if (groupAdmins.includes(mentioned[0])) {
        //if admin then don't remove
        reply("❌ Cannot remove admin!");
        return;
      }
      const response = await sock.groupParticipantsUpdate(
        from,
        mentioned,
        "remove"
      );
      reply("_✔ Number removed from group!_");
    } else {
      //if multiple members are tagged
      reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    let taggedMessageUser = [
      msg.message.extendedTextMessage.contextInfo.participant,
    ];
    if (groupAdmins.includes(taggedMessageUser[0])) {
      //if admin then don't remove
      reply("❌ Cannot remove admin!");
      return;
    }
    const response = await sock.groupParticipantsUpdate(
      from,
      taggedMessageUser,
      "remove"
    );
    reply("_✔ Number removed from group!_");
  }
};
