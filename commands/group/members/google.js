const google = require("googlethis");

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

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;

  let message = "";
  if (
    msg.message.extendedTextMessage &&
    msg.message.extendedTextMessage.contextInfo &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation
  ) {
    //quoted message
    message +=
      msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation +
      "\n\n";
  } else {
    //not a quoted message
    if (
      msg.message.extendedTextMessage &&
      msg.message.extendedTextMessage.text
    ) {
      // message has url, member mentioned
      message = msg.message.extendedTextMessage.text;
    } else {
      // simple text message
      message = msg.message.conversation;
    }
  }

  if (message === "") {
    let message = `❌ Query is not given! \nSend ${prefix}google query`;
    await reply(message);
    return;
  }

  const response = await google.search("TWDG", options);
  const { title, description, url } = response.results[0];
  const text = `*${title}*\n${description}\n\n${url}`;
  reply(text);
};
