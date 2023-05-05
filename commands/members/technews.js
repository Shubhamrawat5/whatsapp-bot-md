const axios = require("axios");

const getNews = async () => {
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  try {
    let url = "https://pvx-api-vercel.vercel.app/api/news";
    const { data } = await axios.get(url);

    let msg = `☆☆💥 Tech News 💥☆☆${readMore}`;
    let inshorts = data.inshorts;
    let count = 0; //for first 14 news only
    for (let i = 0; i < inshorts.length; ++i) {
      ++count;
      if (count === 15) break;
      msg += `\n\n🌐 ${inshorts[i]}`;
    }
    // msg += `\n\njoin TG@pvxtechnews for daily tech news!`;
    return msg;
  } catch (err) {
    console.log(err);
    // return "❌ SOME ERROR CAME!";
    return err.toString();
  }
};

module.exports.command = () => {
  let cmd = ["technews", "tn"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { from } = msgInfoObj;

  let text = await getNews();

  await bot.sendMessage(from, { text }, { quoted: msg });
};
