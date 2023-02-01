const axios = require("axios");
const { storeNewsTech } = require("../db/postTechDB");
const { LoggerBot } = require("./loggerBot");
const pvxtech = "919557666582-1551290369@g.us";

const postTechNews = async (sendMessage) => {
  try {
    let url = "https://pvx-api-vercel.vercel.app/api/news";
    let { data } = await axios.get(url);
    delete data["about"];

    let newsWeb = [
      "gadgets-ndtv",
      "gadgets-now",
      "inshorts",
      "beebom",
      "mobile-reuters",
      "techcrunch",
      "engadget",
    ];

    let res = false;
    let count = 1;

    while (!res) {
      console.log(`TECH NEWS FUNCTION: ${count} times!`);
      if (count > 10) {
        //10 times, already posted news comes up
        return;
      }

      let randomWeb = newsWeb[Math.floor(Math.random() * newsWeb.length)]; //random website
      let index = Math.floor(Math.random() * data[randomWeb].length);
      let news = data[randomWeb][index];

      res = await storeNewsTech(news);
      if (res) {
        console.log("NEW TECH NEWS!");
        await sendMessage(pvxtech, { text: `📰 ${news}` });
      } else {
        console.log("OLD TECH NEWS!");
        count += 1;
      }
    }
  } catch (err) {
    await LoggerBot(undefined, "TECH-NEWS", err, undefined);
  }
};

module.exports = { postTechNews };
