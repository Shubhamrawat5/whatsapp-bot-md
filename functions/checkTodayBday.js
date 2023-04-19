const { LoggerBot } = require("./loggerBot");
const mongoose = require("mongoose");
const uri = process.env.uri;

const getBdayData = async () => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Collection schema
  const bday_schema = new mongoose.Schema({
    name: String,
    username: String,
    date: Number,
    month: Number,
    year: Number,
    numb: Number,
    place: String,
  });

  const Birthday = mongoose.model("birthdays", bday_schema);

  let obj = {};
  const data = await Birthday.find().sort({ date: 1 }); //sort by date

  let arr = [];
  data.forEach((document) => {
    let { name, username, date, month, place, numb } = document;
    arr.push({
      name,
      username,
      date,
      month,
      place,
      numb,
    });

    // {"data":[{},{},{},{},{}]}
    obj["data"] = arr;
  });

  return obj;
};

module.exports.checkTodayBday = async (bot, todayDate, pvxcommunity) => {
  // const checkTodayBday = async (todayDate) => {
  try {
    console.log("CHECKING TODAY BDAY...", todayDate);
    // DB connect

    todayDate = todayDate.split("/");
    let date = todayDate[0];
    date = date.startsWith("0") ? date[1] : date; //05 so take 5
    let month = todayDate[1];
    month = month.startsWith("0") ? month[1] : month; //05 so take 5
    const data = await getBdayData();
    // let url = "https://pvx-api-vercel.vercel.app/api/bday";
    // let { data } = await axios.get(url);
    let bday = [];
    let mentions = [];

    data.data.forEach((member) => {
      if (member.month == month && member.date == date) {
        // bday.push(
        //   `${member.name.toUpperCase()} (${member.username.toUpperCase()})`
        // );
        const number = (member.numb = "91" + member.numb);
        bday.push(`@${number}`);
        mentions.push(number + "@s.whatsapp.net");
        console.log(`Today is ${member.name} Birthday!`);
      }
    });
    if (bday.length) {
      let bdayComb = bday.join(" & ");
      try {
        await bot.groupParticipantsUpdate(pvxcommunity, mentions, "add");
      } catch (err) {
        console.log(err);
      }
      await bot.sendMessage(pvxcommunity, {
        text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nToday is ${bdayComb} Birthday 🍰 🎉🎉`,
        mentions: mentions,
      });
      console.log(
        `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nToday is ${bdayComb} Birthday 🍰 🎉🎉`
      );
      console.log(mentions);
    } else {
      console.log("NO BIRTHDAY!");
      await bot.sendMessage(pvxcommunity, {
        text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nThere is no Birthday today!`,
      });
    }
    await bot.groupUpdateSubject(pvxcommunity, "<{PVX}> COMMUNITY ❤️");
  } catch (err) {
    await LoggerBot(bot, "TODAY-BDAY", err, undefined);
    console.log(err);
  }
};
// let todayDate = new Date().toLocaleDateString("en-GB", {
//   timeZone: "Asia/kolkata",
// });
// checkTodayBday(todayDate);
