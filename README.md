## New Multi Device Whatsapp Bot

Easy deploy your bot, steps in the bottom.

**_Requirements :_**

- Heroku account
- Heroku cli
- Git

# Instructions:- :rocket:

## Git Setup

### Download and install git from (https://git-scm.com/downloads)

## Heroku Setup

1. Create account on heroku. (https://signup.heroku.com/)

2. After login on heroku dashboard create an app on heroku (https://dashboard.heroku.com/apps)

3. In the 'Resources' tab search for 'Heroku Postgres' in Add-ons and add it to your heroku app.

4. In the 'Deploy' section download Heroku CLI or from (https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

## Heroku CLI

1. After downloading and installing Heroku CLI in your system login to heroku cli using `heroku login` in command prompt or powershell.
2. Add ffmpeg (_for sticker support_) in your heroku app using `heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git -a <your-app-name>`
3. After adding ffmpeg now add 'Heroku Buildpack for Node.js' using `heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs.git -a <your-app-name>`
4. Now download or clone the whatsapp-bot repo by `git clone https://github.com/Shubhamrawat5/whatsapp-bot-md.git`
5. Now enter in whatsapp-bot directory using `cd whatsapp-bot-md` in command prompt or terminal.
6. Create the remote region using `heroku git:remote -a <your-app-name>`
7. Now push the local repo in your heroku app using `git push heroku master`
8. Now after the deploy process is completed use `heroku logs -a <your-app-name> --tail` to get real time logs from heroku app.
9. In real time logs it will automatically ask you for login using qr code just simple scan the qr code using your whatsapp web section, and you are done.

Now Bot will start working!! Work even if the device is offline!!

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
|      `!help`      |    Display public commands     | `!h`  |
|     `!helpa`      |     Display admin commands     |       |
|     `!helpo`      |   Display bot owner commands   |       |
|    `!donation`    |      Get Donation details      |       |
|     `!delete`     |     Delete message of bot      | `!d`  |
|     `!alive`      |     Check bot is ON or OFF     | `!a`  |
|    `!feedback`    |       Get feedback form        |       |
|  `!votecommand`   |   Get list of vote commands    | `!vc` |
|    `!pvxlink`     |     Get group links of PVX     |       |
|      `!dev`       |     Get the contact of dev     |       |
| `!cricketcommand` |  Get list of cricket commands  | `!cc` |
|     `!source`     |       Get the bot source       |       |
|     `!steal`      | Change sticker name to PVX BOT |       |

<hr>

| Member Commands |                    Description                    |  Alias   |
| :-------------: | :-----------------------------------------------: | :------: |
|    `!count`     |        Know message count in current group        |          |
|    `!total`     |       Know message count in all PVX groups        |          |
|     `!rank`     |    Know message count & rank in all PVX groups    |          |
|    `!ranks`     |           Know ranks list of PVX groups           |          |
|    `!totalg`    |    Know message count group wise in PVX groups    |          |
|   `!sticker`    |     Create sticker from different media types     |   `!s`   |
|    `!block`     |      To block particular commands for group       |          |
|    `!image`     |             Create image from sticker             |          |
|     `!song`     |           Get any song in good quality            |          |
|    `!insta`     |          Get insta reels or post videos           |   `!i`   |
|      `!fb`      |                Get facebook videos                |          |
|     `!ytv`      |              Download youtube videos              |          |
|     `!yta`      |              Download youtube audio               |          |
|   `!technews`   |               Get latest Tech news                |          |
|    `!drive`     |           Get GDrive files direct link            |          |
|    `!quote`     |                Give a random quote                |          |
|    `!gender`    |            Get gender from first name             |          |
|    `!score`     |                Give Cricket score                 |          |
|  `!scorecard`   |              Give Cricket scorecard               |  `!sc`   |
|    `!startc`    |            Start Cricket score updated            |          |
|    `!stopc`     |            Stop Cricket score updated             |          |
|  `!startvote`   |               Start voting in group               |          |
|     `!vote`     |                 Vote for a choice                 |          |
|  `!checkvote`   |          Check status of current voting           |  `!cv`   |
|   `!stotvote`   |            Stop voting and see result             |          |
|   `!votepvx`    |       Vote for a choice for all PVX groups        |          |
| `!checkvotepvx` | Check status of current voting for all PVX groups | `!cvpvx` |
|    `!rules`     |               Get PVX groups rules                |   `!r`   |

<hr>

|   Admin Commands   |                       Description                       |  Alias  |
| :----------------: | :-----------------------------------------------------: | :-----: |
|       `!add`       |                   Add member to group                   |         |
|      `!kick`       |                 kick member from group                  | `!ban`  |
|      `!mute`       |                     Mute the group                      |         |
|     `!unmute`      |                    Unmute the group                     |         |
|    `!tagadmins`    |                 Tag all admins of group                 |  `!ta`  |
|     `!warning`     |                  Give warning to user                   | `!warn` |
|      `!pvxg`       |          Get message count stats of PVX groups          |         |
|      `!pvxm`       |  Get members message count stats of current PVX group   |         |
|      `!pvxt`       |    Get top members message count stats of PVX groups    |         |
|      `!pvxt5`      | Get top 5 members message count stats of all PVX groups |         |
|      `!zero`       |          Get members list with 0 message count          |         |
|    `!pvxstats`     |                 Get stats of PVX groups                 |         |
|    `!blacklist`    |                  Get blacklist numbers                  |         |
|  `!blacklistadd`   |                 Add number to blacklist                 | `!bla`  |
| `!blacklistremove` |              Remove number from blacklist               | `!blr`  |

<hr>

| Owner Commands  |                  Description                  | Alias |
| :-------------: | :-------------------------------------------: | :---: |
| `!donationadd`  |             Add Donation details              | `!da` |
|  `!countstats`  |      Get stats of number of command used      |       |
|     `!test`     |      execute code with whatsapp directly      |       |
|  `!broadcast`   |       Broadcast a message to all groups       | `!bc` |
|    `!tagall`    |           Tag all members in group            |       |
|    `!gname`     |            Save group names to DB             |       |
|      `!tg`      |            Make TG to WA stickers             |       |
|     `!stg`      |            Stop TG to WA stickers             |       |
| `!groupbackup`  |            Take group backup in DB            |       |
| `!startvotepvx` |        Start voting for all PVX groups        |       |
| `!stotvotepvx`  | Stop voting and see result for all PVX groups |       |

- CRICKET SCORES:

  > Put match id in starting of group description.

  > Get match ID from cricbuzz url, like https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 so match ID is `37572`

- Block any command for particular group

  > Give command name (with comma seperated and without spaces) to be blocked in first line of group description like `score,add,quote`

  > If matchId is to be added in description along with blocked commands then add in starting of first line, like `82621,score,add,quote`

- Other than 91 numbers are not allowed

  > Put `only91` text in first line of description of group to instant ban every number joined other than 91 indian numbers

- GROUP DESCRIPTION EXAMPLE:

   <img src="https://i.ibb.co/2Z8t9Qm/IMG-20211006-154704.jpg" width="400"/>

  > Always put match ID in starting of first line!

  > `91only` is command name and `only91` is to ban

# Run locally:- :rocket:

Create a `.env` file for enviromental variables in local directory with following values without quote

    myNumber = "your-number-to-receive-all-updates"
    DATABASE_URL = "get-from-heroku-dashboard"

Get value of database_url from Heroku dashboard > settings > reveal config vars

Run the index file by `node index.js`

# Note:- :rocket:

Since heroku uses:- Dyno sleeping in which if an app has a free web dyno, and that dyno receives no web traffic in a 30-minute period, it will sleep. In addition to the web dyno sleeping, the worker dyno (if present) will also sleep. and if a sleeping web dyno receives web traffic, it will become active again after a short delay (assuming your account has free dyno hours available)
You can use (http://kaffeine.herokuapp.com) to ping the heroku app every 30 minutes to prevent it from sleeping.

# References:- :rocket:

- [@Baileys](https://github.com/adiwajshing/Baileys)
- Old non md wa bot [PVX Bot](https://github.com/Shubhamrawat5/whatsapp-bot).

# Easy way to deploy:- :rocket:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Shubhamrawat5/whatsapp-bot-md)

Your bot will be deployed on heroku but still you need to install heroku locally to scan QR code

1. Download Heroku CLI from [here](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
2. Open terminal
3. Type command `heroku login` and give access
4. Type command `heroku logs -a <your-app-name> --tail`

Now you'll see QR code, scan with your device and bot will start working!

- To get owner commands

  Go to heroku daskboard then settings then config vars

  Add KEY as `myNumber` and VALUE as `911234567890` (your number with country code and no + sign)
