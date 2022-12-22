const axios = require("axios");
const pvxcommunity = "919557666582-1467533860@g.us";

module.exports.checkTodayBday = async (todayDate) => {
  console.log("CHECKING TODAY BDAY...", todayDate);
  todayDate = todayDate.split("/");
  let d = todayDate[0];
  d = d.startsWith("0") ? d[1] : d;
  let m = todayDate[1];
  m = m.startsWith("0") ? m[1] : m;
  let url = "https://pvxgroup.herokuapp.com/api/bday";
  let { data } = await axios.get(url);
  let bday = [];

  data.data.forEach((member) => {
    if (member.month == m && member.date == d) {
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
  try {
    await bot.groupUpdateSubject(pvxcommunity, "<{PVX}> COMMUNITY ❤️");
  } catch (err) {
    console.log(err);
  }
};
