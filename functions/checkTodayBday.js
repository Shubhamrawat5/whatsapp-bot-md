const axios = require("axios");
const { LoggerBot } = require("./loggerBot");
const pvxcommunity = "919557666582-1467533860@g.us";

module.exports.checkTodayBday = async (bot, todayDate) => {
  try {
    console.log("CHECKING TODAY BDAY...", todayDate);
    todayDate = todayDate.split("/");
    let date = todayDate[0];
    date = date.startsWith("0") ? date[1] : date; //05 so take 5
    let month = todayDate[1];
    month = month.startsWith("0") ? month[1] : month; //05 so take 5
    let url = "https://pvx-api-vercel.vercel.app/api/bday";
    let { data } = await axios.get(url);
    let bday = [];

    data.data.forEach((member) => {
      if (member.month == month && member.date == date) {
        bday.push(
          `${member.name.toUpperCase()} (${member.username.toUpperCase()})`
        );
        console.log(`Today is ${member.name} Birthday!`);
      }
    });
    if (bday.length) {
      let bdayComb = bday.join(" & ");
      await bot.sendMessage(pvxcommunity, {
        text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nToday is ${bdayComb} Birthday 🍰 🎉🎉`,
      });
    } else {
      console.log("NO BIRTHDAY!");
      await bot.sendMessage(pvxcommunity, {
        text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nThere is no Birthday today!`,
      });
    }
    await bot.groupUpdateSubject(pvxcommunity, "<{PVX}> COMMUNITY ❤️");
  } catch (err) {
    await LoggerBot(bot, "TODAY-BDAY", err, undefined);
  }
};
