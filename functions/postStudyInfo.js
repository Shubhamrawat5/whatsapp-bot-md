const Parser = require("rss-parser");
const parser = new Parser();
const { storeNewsStudy } = require("../db/postStudyDB");
const { LoggerBot } = require("./loggerBot");

const postStudyInfo = async (sendMessage, pvxstudy) => {
  try {
    // "https://www.thehindu.com/news/national/feeder/default.rss"
    // "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms"
    // "https://zeenews.india.com/rss/india-national-news.xml"
    let feed = await parser.parseURL(
      "https://www.mid-day.com/Resources/midday/rss/india-news.xml"
    );

    let li = feed.items.map((item) => {
      return { title: item.title, link: item.link };
    });

    let res = false;
    let count = 1;

    while (!res) {
      console.log(`STUDY NEWS FUNCTION ${count} times!`);
      if (count > 10) {
        //10 times, already posted news comes up
        return;
      }

      let index = Math.floor(Math.random() * li.length);
      let news = li[index];

      res = await storeNewsStudy(news.title);
      if (res) {
        console.log("NEW STUDY NEWS!");
        await sendMessage(pvxstudy, { text: `📰 ${news.title}` });
      } else {
        console.log("OLD STUDY NEWS!");
        count += 1;
      }
    }
  } catch (err) {
    await LoggerBot(undefined, "STUDY-NEWS", err, undefined);
  }
};

module.exports = { postStudyInfo };
