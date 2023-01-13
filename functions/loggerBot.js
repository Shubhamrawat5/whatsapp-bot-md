const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const myNumber = process.env.myNumber;
const pvx = process.env.pvx;
const token = process.env.TG_BOT; //tg bot token here
const kryptonChatId = 649341653; // my chat id to receive all the updates
const botTG = new TelegramBot(token, { polling: false });

module.exports.LoggerBot = async (botWA, eventType, err, msgObj) => {
  const errMsg = err.toString();
  const msg = JSON.stringify(msgObj);

  const loggerMsg = `ERROR [${eventType}]:\n${errMsg}\nmsg: ${msg}`;
  console.log(loggerMsg);
  if (pvx) botTG.sendMessage(kryptonChatId, loggerMsg);
  if (botWA)
    await botWA.sendMessage(myNumber + "@s.whatsapp.net", {
      text: loggerMsg,
    });
};

module.exports.LoggerTg = async (message) => {
  if (pvx) botTG.sendMessage(kryptonChatId, message);
};
