const fs = require("fs")
const Discord = require("discord.js")

const client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"))

const { prefix, token } = require("./config.json")

let queue = new Map()

client.once("ready", () => {
  console.log("Ready!")
})

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  if (!client.commands.has(command)) return message.reply("That command isn't valid") // command wasn't found

  try {
    client.commands.get(command).execute(message, args, queue)
  } catch (error) {
    console.error(error)
    message.reply("there was an error trying to execute that command!")
  }
})

client.login(token)
