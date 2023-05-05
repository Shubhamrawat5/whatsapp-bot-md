const axios = require("axios");

const getQuote = async () => {
  try {
    let url = "https://zenquotes.io/api/random";
    let { data } = await axios.get(url);
    let quote = "💬 " + data[0].q;
    // console.log(quote);
    return quote;
  } catch (err) {
    console.log(err);
    // return "❌ SOME ERROR CAME!";
    return err.stack;
  }
};

module.exports.command = () => {
  return { cmd: ["quote"], handler: handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  const { reply } = msgInfoObj;
  let text = await getQuote();

  await reply(text);
};
