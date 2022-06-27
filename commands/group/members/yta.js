const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const ytdl = require("ytdl-core");
const fs = require("fs");

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

module.exports.command = () => {
  let cmd = ["yta"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  if (args.length === 0) {
    sock.sendMessage(
      from,
      { text: `❌ URL is empty! \nSend ${prefix}yta url` },
      { quoted: msg }
    );
    return;
  }
  try {
    let urlYt = args[0];
    if (!urlYt.startsWith("http")) {
      sock.sendMessage(
        from,
        { text: `❌ Give youtube link!` },
        { quoted: msg }
      );
      return;
    }
    let infoYt = await ytdl.getInfo(urlYt);
    //30 MIN
    if (infoYt.videoDetails.lengthSeconds >= 1800) {
      sock.sendMessage(from, { text: `❌ Video too big!` }, { quoted: msg });
      return;
    }
    let titleYt = infoYt.videoDetails.title;
    let randomName = getRandom(".mp3");

    const stream = ytdl(urlYt, {
      filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
    }).pipe(fs.createWriteStream(`./${randomName}`));
    console.log("Audio downloading ->", urlYt);
    // reply("Downloading.. This may take upto 5 min!");
    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    let stats = fs.statSync(`./${randomName}`);
    let fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    console.log("Audio downloaded ! Size: " + fileSizeInMegabytes);
    if (fileSizeInMegabytes <= 40) {
      sock.sendMessage(
        from,
        {
          document: fs.readFileSync(`./${randomName}`),
          fileName: titleYt + ".mp3",
          mimetype: "audio/mpeg",
        },
        { quoted: msg }
      );
    } else {
      sock.sendMessage(
        from,
        { text: s`❌ File size bigger than 40mb.` },
        { quoted: msg }
      );
    }

    fs.unlinkSync(`./${randomName}`);
  } catch (err) {
    console.log(err);
    sock.sendMessage(
      from,
      { text: `❌ There is some problem.` },
      { quoted: msg }
    );
  }
};
