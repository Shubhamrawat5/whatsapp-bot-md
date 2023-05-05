const google = require("googlethis");
const { getMessage } = require("../../functions/getMessage");

const options = {
  page: 0,
  safe: false, // Safe Search
  parse_ads: false, // If set to true sponsored results will be parsed
  additional_params: {
    // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
    hl: "en",
  },
};

module.exports.command = () => {
  return { cmd: ["google", "search", "gs"], handler: handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { prefix, reply, command } = msgInfoObj;

  try {
    const message = await getMessage(msg, prefix, command);

    if (message === "") {
      let message = `❌ Query is not given! \nSend ${prefix}google query`;
      await reply(message);
      return;
    }

    const response = await google.search(message, options);
    const { title, description, url } = response.results[0];
    const text = `*${title}*\n${description}\n\n${url}`;
    reply(text);
  } catch (error) {
    reply(error.toString());
  }
};
