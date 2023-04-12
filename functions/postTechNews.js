const axios = require("axios");
const { storeNewsTech } = require("../db/postTechDB");
const { LoggerBot } = require("./loggerBot");
const pvxtech = "919557666582-1551290369@g.us";
require("dotenv").config();

const newsapi = process.env.newsapi;

const postTechNews = async (sendMessage) => {
  try {
    let url =
      "https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=" +
      newsapi;
    let { data } = await axios.get(url);
    const articles = data.articles;

    let res = false;
    let count = 1;

    while (!res) {
      console.log(`TECH NEWS FUNCTION: ${count} times!`);
      if (count > 10) {
        //10 times, already posted news comes up
        return;
      }

      let index = Math.floor(Math.random() * articles.length);
      let { title, description, url } = articles[index];

      res = await storeNewsTech(title);
      if (res) {
        console.log("NEW TECH NEWS!");
        await sendMessage(pvxtech, {
          text: `📰 *${title}*\n\n_${description}_\nSource: ${url}`,
        });
      } else {
        console.log("OLD TECH NEWS!");
        count += 1;
      }
    }
  } catch (err) {
    await LoggerBot(undefined, "TECH-NEWS", err, undefined);
  }
};

const postTechNewsPvx = async (sendMessage) => {
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
