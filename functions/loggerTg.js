const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TG_BOT; //tg bot token here
const pvx = process.env.pvx;
const kryptonChatId = 649341653; // my chat id to receive all the updates
const bot = new TelegramBot(token, { polling: false });

module.exports.LoggerTg = async (message) => {
  if (pvx) bot.sendMessage(kryptonChatId, message);
};
