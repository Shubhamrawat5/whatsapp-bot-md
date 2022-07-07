const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["add"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, isBotGroupAdmins } = msgInfoObj;

  const reply = (text) => {
    sock.sendMessage(from, { text }, { quoted: msg });
  };

  if (!isBotGroupAdmins) {
    reply("❌ I'm not Admin here!");
    return;
  }

  let num;
  if (msg.message.extendedTextMessage) {
    //member's message is tagged to add
    num = msg.message.extendedTextMessage.contextInfo.participant;
  } else {
    //number is given like !add 919557---82
    if (args.length === 0) {
      reply("❌ Give number to add!");
      return;
    }
    num = `${args.join("").replace(/ |-|\(|\)/g, "")}@s.whatsapp.net`; //remove spaces , ( , ) and -
    if (num.startsWith("+")) {
      //remove + sign from starting if given
      num = num.slice(1);
    }
  }

  const response = await sock.groupParticipantsUpdate(from, [num], "add");
  // console.log("RES:", response);

  //TODO: response is not object
  let number = `${num.split("@s.whatsapp.net")[0]}`;
  let get_status = response[`${number}@c.us`];
  if (get_status == 400) {
    reply("_❌ Invalid number, include country code also!_");
  } else if (get_status == 403) {
    reply("_❌ Number has privacy on adding group!_");
  } else if (get_status == 408) {
    reply("_❌ Number has left the group recently!_");
  } else if (get_status == 409) {
    reply("_❌ Number is already in group!_");
  } else if (get_status == 500) {
    reply("_❌ Group is currently full!_");
  } else if (get_status == 200) {
    reply("_✔ Number added to group!_");
  }
};
