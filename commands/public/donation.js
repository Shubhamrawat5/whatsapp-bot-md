const { getDonation } = require("../../db/donationDB");
const fs = require("fs");

module.exports.command = () => {
  let cmd = ["donation", "donations", "donate"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  const { from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let donaResult = await getDonation();
  // console.log(donaResult);
  let totalDona = 0;
  let donaMsgTemp = "";
  donaResult.forEach((dona, index) => {
    totalDona += dona.amount;
    donaMsgTemp += `\n❤️ Rs ${dona.amount} - ${dona.name}`;
  });

  let donaMsg = `Helping PVX COMMUNITY to grow and provide good stuff for all members.\nUse cases: domain name for PVX website, giveaways, tournaments in future, server for all bots and website, etc etc.\n\n*Any amount is appreciated.*\n\nUPI: shubhamraw123@okhdfcbank , shubhamraw123@okaxis\n\nAfter sending donation, take a screenshot and send to https://wa.me/916397867115 with your name. [Your name will be shown here after that]\n\n*Total Donations: Rs ${totalDona}*`;

  donaMsg += donaMsgTemp;

  await bot.sendMessage(
    from,
    {
      image: fs.readFileSync(__dirname + "/../../assert/donation.jpg"),
      caption: donaMsg,
      detectLinks: true,
    },
    { quoted: msg }
  );
};
