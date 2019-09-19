## How to use

1. Make sure you have [nodejs](https://nodejs.org/en/) installed.
2. Clone this repository in your directory of choice by running the following in your terminal `git clone https://github.com/Mohcka/discord-music-bot.git`
3. Run `npm install` then `npm start` and the program should be running.  Ensure you've [received your own discord application token and added the bot to your server](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token), also [create a youtube api token](https://developers.google.com/youtube/registering_an_application) as well and input them inside the `config.json` file in the root of your application as such:

```json
{
  "prefix": "$",
  "token": "some.discord.token",
  "yt-api-token": "youryoutubetoken"
}
```
4. Once the bot is running in your server enter `$play [your favtorite song here]` and jam out with you and your friends