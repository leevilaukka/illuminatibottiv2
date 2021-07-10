# IlluminatiBotti

Custom (mostly) Finnish Discord.js bot made with TypeScript.

## Local installation
If you want to test the bot locally follow these steps:
- Clone the repo.
- Run `npm install` to install dependencies.
- Make sure you have your environment variables set correctly.
  - You will need your own bot token from the [Discord Developer Portal](https://discord.com/developers/).
  - You will also need your own MongoDB database for the bot to function properly.
  - Refer to `.env.example` for more info.
- Make sure you have TypeScript installed.
- Build the bot using `tsc`.
- Run `build/bot.js` using Node.

## Changing default settings
Most of the default settings come from env variables, but some default settings, for example the command prefix and music volume, have to be set in `src/config.ts`. 