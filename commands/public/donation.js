const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { addDonation, getDonation } = require("../../db/donationDB");
const fs = require("fs");

module.exports.command = () => {
  let cmd = ["donation", "donate"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let donaResult = await getDonation();
  let donaMsgTemp = "";
  donaResult.forEach((dona, index) => {
    totalDona += dona.amount;
    donaMsgTemp += `\n❤️ Ksh ${dona.amount} - ${dona.name}`;
  });

  let donaMsg = `Send any amount to 0703733399, any amout is appreciated.\nAfter sending donation, kindly send a screenshot of payment details to https://wa.me/254754423664 with your name. \n*Thanks*`;

  donaMsg += donaMsgTemp;

  sock.sendMessage(
    from,
    {
      image: fs.readFileSync(__dirname + "/../../assert/donation.jpg"),
      caption: donaMsg,
      detectLinks: true,
    },
    { quoted: msg }
  );
};
