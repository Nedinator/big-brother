# Intro

> 'Big-Brother' is a open source Discord bot meant to log data in the background and be used as a safety net for Discord server staff teams. It logs kicks and bans globally in all servers the bot is in. The more the bot grows the more safe each server will be, is the theory at least. In the future, messages will be able to be flagged as problematic and that data would be shared globally as well.
> k

## Technologies/Frameworks/APIs

- Node.JS/NPM
- Discord.JS
- MongoDB/Mongoose

## Setup

> This is quick and dirty setup, I'll get something nicer up soon

    1. Create a local directory of your choosing, and in the terminal in this directory run `git clone https://github.com/Nedinator/big-brother` in terminal.
    2. Run `npm install` in terminal of local directory.
    3. Create file in main directory named `.env` and add `TOKEN=YOURTOKENHERE` and replace 'YOURTOKENHERE' with your Discord bot token from http://discord.com/developers
    4. Run the bot using `node index.js`.
