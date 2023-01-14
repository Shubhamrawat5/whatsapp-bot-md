const { getCountVideo } = require("../db/countVideoDB");
const pvxmano = "19016677357-1630334490@g.us";

module.exports.kickZeroMano = async (bot, num_split) => {
  try {
    let resultCountGroupIndi = await getCountVideo(pvxmano);

    let memWithMsg = new Set();
    for (let member of resultCountGroupIndi) {
      memWithMsg.add(member.memberjid);
    }

    const groupMetadata = await bot.groupMetadata(pvxmano);
    const groupMembers = groupMetadata.participants;

    let zeroMano = [];
    groupMembers.forEach((mem) => {
      if (!memWithMsg.has(mem.id)) {
        zeroMano.push(mem.id);
      }
    });

    let randomMemId = zeroMano[Math.floor(Math.random() * zeroMano.length)];
    let num_split = `${randomMemId.split("@s.whatsapp.net")[0]}`;

    console.log(`Removing ${randomMemId} from Mano.`);
    await bot.sendMessage(pvxmano, {
      text: `Removing  @${num_split}\nReason: 0 videos count! `,
      mentions: [randomMemId],
    });
    await bot.groupParticipantsUpdate(pvxmano, [randomMemId], "remove");

    // randomMemId = zeroMano[Math.floor(Math.random() * zeroMano.length)];
    // num_split = `${randomMemId.split("@s.whatsapp.net")[0]}`;
    // console.log(`Removing ${randomMemId} from Mano.`);
    // await bot.sendMessage(pvxmano, {
    //   text: `Removing  @${num_split}\nReason: 0 videos count! `,
    //   mentions: [randomMemId],
    // });
    // await bot.groupParticipantsUpdate(pvxmano, [randomMemId], "remove");
  } catch (err) {
    await LoggerBot(bot, "KICK-MANO", err, undefined);
  }
};
