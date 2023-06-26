## New Multi Device Whatsapp Bot

Typescipt updated -> https://github.com/Shubhamrawat5/whatsapp-bot-ts

Webpage -> https://shubhamrawat5.github.io/whatsapp-bot-md/

<img src="https://i.ibb.co/Fmk9bhG/bot.jpg" width="300" height="300">

**_Requirements :_**

- Git
- Node js

# Instructions:- :rocket:

## Git Setup

### Download and install git from (https://git-scm.com/downloads)

    git clone https://github.com/Shubhamrawat5/whatsapp-bot-md.git

### Download and install nodejs from (https://nodejs.org/en/download)

## Local Setup

1. Create account on elephantsql. (https://www.elephantsql.com/)

2. After login, get the database URL from details section. It'll be like: postgres://yourfullURL@tiny.db.elephantsql.com/yourURL

3. Create a local `.env` file with following variables and save the file:

   DATABASE_URL = postgres://yourfullURL@tiny.db.elephantsql.com/yourURL

   myNumber = 911234567890

4. Run the index file by `node index.js`

5. It'll ask for QR code scan, scan it and bot will start working.

# Features:- :rocket:

1. It count messages of every member in all the groups in DB. (just the message count, not actual text message), so that we can see stats like top members, top groups, etc.
2. It also forwards every sticker that is sent to any of the PVX groups to another group i.e. Sticker Only, where members can have access to different different types of stickers 24x7.
3. It posts tech news to tech group and trending india news to study group every 20 min.
4. It notifys the birthday in the community group when new day starts.
5. It welcomes new users when joined with some questions/rules.
6. It automatically bans any user with a non-Indian number (any number without +91 code).

## Default prefix : `!`

## Commands :

|  Public Commands  |          Description           | Alias |
| :---------------: | :----------------------------: | :---: |
|      `!help`      |    Display public commands     |       |
|     `!helpa`      |     Display admin commands     |       |
|     `!helpo`      |   Display bot owner commands   |       |
|    `!donation`    |      Get Donation details      |       |
|     `!alive`      |     Check bot is ON or OFF     | `!a`  |
|    `!feedback`    |       Get feedback form        |       |
|  `!votecommand`   |   Get list of vote commands    | `!vc` |
|    `!pvxlink`     |     Get group links of PVX     |       |
|      `!dev`       |     Get the contact of dev     |       |
| `!cricketcommand` |  Get list of cricket commands  | `!cc` |
|     `!source`     |       Get the bot source       |       |
|     `!steal`      | Change sticker name to PVX BOT |       |

<hr>

| Member Commands |                    Description                    |    Alias     |
| :-------------: | :-----------------------------------------------: | :----------: |
|  `!tagadmins`   |              Tag all admins of group              |    `!ta`     |
|   `!sticker`    |     Create sticker from different media types     |     `!s`     |
|      `!ai`      |                Ask questions to AI                |              |
|     `!text`     |             Create sticker from text              |              |
|    `!insta`     |          Get insta reels or post videos           |     `!i`     |
|     `!ytv`      |              Download youtube videos              |              |
|     `!yta`      |              Download youtube audio               |              |
|     `!song`     |           Get any song in good quality            |              |
|     `!rank`     |    Know message count & rank in all PVX groups    |              |
|    `!ranks`     |           Know ranks list of PVX groups           |              |
|    `!count`     |    Know message count group wise in PVX groups    |              |
|    `!image`     |             Create image from sticker             |              |
| `!imagesearch`  |            Search image from any name             |    `!is`     |
| `!searchsearch` |           Search sticker from any name            |    `!ss`     |
|      `!fb`      |                Get facebook videos                |              |
|   `!technews`   |               Get latest Tech news                |              |
|    `!drive`     |           Get GDrive files direct link            |              |
|    `!quote`     |                Give a random quote                |              |
|     `!horo`     |              Check today's horoscope              |              |
|    `!gender`    |            Get gender from first name             |              |
|    `!score`     |                Give Cricket score                 |              |
|  `!scorecard`   |              Give Cricket scorecard               | `!sc`, `!sb` |
|    `!startc`    |            Start Cricket score updated            |              |
|    `!stopc`     |            Stop Cricket score updated             |              |
|  `!startvote`   |               Start voting in group               |              |
|     `!vote`     |                 Vote for a choice                 |              |
|  `!checkvote`   |          Check status of current voting           |    `!cv`     |
|   `!stotvote`   |            Stop voting and see result             |              |
|   `!votepvx`    |       Vote for a choice for all PVX groups        |              |
| `!checkvotepvx` | Check status of current voting for all PVX groups |   `!cvpvx`   |
|    `!rules`     |               Get PVX groups rules                |     `!r`     |

<hr>

|   Admin Commands   |                          Description                           |     Alias     |
| :----------------: | :------------------------------------------------------------: | :-----------: |
|       `!add`       |                      Add member to group                       |               |
|      `!kick`       |                     kick member from group                     |    `!ban`     |
|      `!mute`       |                         Mute the group                         |               |
|     `!unmute`      |                        Unmute the group                        |               |
|     `!delete`      |                     Delete anyone message                      |     `!d`      |
|     `!warning`     |                      Give warning to user                      |    `!warn`    |
|   `!warninglist`   |                  Check warning of all members                  |  `!warnlist`  |
|  `!warningreduce`  |                     Reduce warning to user                     | `!warnreduce` |
|  `!warningclear`   |                   Clear all warning to user                    | `!warnclear`  |
|  `!warningcheck`   |                     Check warning to user                      | `!warncheck`  |
|     `!enable`      |                Enable command for current group                |               |
|     `!disable`     |               Disable command for current group                |               |
|      `!pvxg`       |             Get message count stats of PVX groups              |               |
|      `!pvxm`       |      Get members message count stats of current PVX group      |               |
|      `!pvxtm`      | Get members message count stats with rank of current PVX group |   `!pvxmt`    |
|      `!pvxt`       |       Get top members message count stats of PVX groups        |               |
|      `!pvxt5`      |    Get top 5 members message count stats of all PVX groups     |               |
|      `!zero`       |             Get members list with 0 message count              |               |
|    `!pvxstats`     |                    Get stats of PVX groups                     |               |
|    `!blacklist`    |                     Get blacklist numbers                      |               |
|  `!blacklistadd`   |                    Add number to blacklist                     |    `!bla`     |
| `!blacklistremove` |                  Remove number from blacklist                  |    `!blr`     |

<hr>

| Owner Commands  |                  Description                  | Alias |
| :-------------: | :-------------------------------------------: | :---: |
| `!donationadd`  |             Add Donation details              | `!da` |
|  `!countstats`  |      Get stats of number of command used      |       |
|     `!test`     |      execute code with whatsapp directly      |       |
|  `!broadcast`   |       Broadcast a message to all groups       | `!bc` |
|    `!tagall`    |           Tag all members in group            |       |
|    `!gname`     |            Save group names to DB             |       |
|   `!setlink`    |             Save group link in DB             | `!sl` |
|   `!getlink`    |          Get all group links from DB          | `!sl` |
|      `!tg`      |            Make TG to WA stickers             |       |
|     `!stg`      |            Stop TG to WA stickers             |       |
| `!groupbackup`  |            Take group backup in DB            |       |
| `!startvotepvx` |        Start voting for all PVX groups        |       |
| `!stotvotepvx`  | Stop voting and see result for all PVX groups |       |

- CRICKET SCORES:

  > Put match id in starting of group description.

  > Get match ID from cricbuzz url, Example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021, so match ID is `37572`

  <!-- EXAMPLE:

  <img src="https://i.ibb.co/2Z8t9Qm/IMG-20211006-154704.jpg" width="400"/> --> -->

<!-- # Note:- :rocket: -->

<!-- Since heroku uses:- Dyno sleeping in which if an app has a free web dyno, and that dyno receives no web traffic in a 30-minute period, it will sleep. In addition to the web dyno sleeping, the worker dyno (if present) will also sleep. and if a sleeping web dyno receives web traffic, it will become active again after a short delay (assuming your account has free dyno hours available)
You can use (http://kaffeine.herokuapp.com) to ping the heroku app every 30 minutes to prevent it from sleeping. -->

# References:- :rocket:

- Nodejs package - [Baileys](https://github.com/adiwajshing/Baileys)
- Old non-md wa bot - [PVX Bot](https://github.com/Shubhamrawat5/whatsapp-bot)

<!-- # Easy way to deploy:- :rocket:

[Heroku is no longer free]

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Shubhamrawat5/whatsapp-bot-md)

Your bot will be deployed on heroku but still you need to install heroku locally to scan QR code

1. Download Heroku CLI from [here](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
2. Open terminal
3. Type command `heroku login` and give access
4. Type command `heroku logs -a <your-app-name> --tail`

Now you'll see QR code, scan with your device and bot will start working!

- To get owner commands

  Go to heroku daskboard then settings then config vars

  Add KEY as `myNumber` and VALUE as `911234567890` (your number with country code and no + sign) -->
