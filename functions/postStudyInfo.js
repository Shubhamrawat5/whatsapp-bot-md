const Parser = require("rss-parser");
const parser = new Parser();
const { storeNewsStudy } = require("../db/postStudyDB");
const { LoggerBot } = require("./loggerBot");
const pvxstudy = "919557666582-1617595892@g.us";

const postStudyInfo = async (bot, count) => {
  try {
    if (count > 10) {
      //10 times already posted news came
      return;
    }
    console.log(`STUDY NEWS FUNCTION ${count} times!`);
    let feed;
    // "https://www.thehindu.com/news/national/feeder/default.rss"
    // "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms"
    // "https://zeenews.india.com/rss/india-national-news.xml"
    feed = await parser.parseURL(
      "https://www.mid-day.com/Resources/midday/rss/india-news.xml"
    );

    let li = feed.items.map((item) => {
      return { title: item.title, link: item.link };
    });

    let index = Math.floor(Math.random() * li.length);

    let news = li[index];

    let techRes = await storeNewsStudy(news.title);
    if (techRes) {
      console.log("NEW STUDY NEWS!");
      await bot.sendMessage(pvxstudy, { text: `📰 ${news.title}` });
    } else {
      console.log("OLD STUDY NEWS!");
      postStudyInfo(bot, count + 1);
    }
  } catch (err) {
    await LoggerBot(bot, "STUDY-NEWS", err, undefined);
  }
};

module.exports = { postStudyInfo };
