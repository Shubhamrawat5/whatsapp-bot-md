const { addDonation } = require("../../db/donationDB");
module.exports.command = () => {
  let cmd = ["donationadd", "da"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;
  let body = msg.message.conversation;
  if (args.length == 0) {
    await reply(`❌ Error! Add by ${prefix}adddonation #name #amount`);
    return;
  }
  console.log(body.trim());
  console.log(body.trim().replace(/ +/, ","));
  let donaList = body.trim().replace(/ +/, ",").split(",")[1].split("#");
  if (donaList.length < 3) {
    await reply(`❌ Error! Add by ${prefix}adddonation #name #amount`);
    return;
  }
  let donaName = donaList[1].trim();
  let donaAmount = Number(donaList[2].trim());
  if (donaName && donaAmount) {
    let addDonaRes = await addDonation(donaName, donaAmount);
    if (addDonaRes) await reply("✔️ Added!");
    else await reply("❌ Error!");
  } else await reply(`❌ Error! Add by ${prefix}adddonation #name #amount`);
};
