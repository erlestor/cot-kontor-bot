import fs from "fs"
import { Client } from "discord.js"

import { deployCommands } from "./deploy-commands"
import { config } from "./config"
import { commands } from "./commands"

// api
import express, { type Express, type Request, type Response } from "express"
import { randomUUID } from "crypto"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
})

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖")
  await deployCommands({ guildId: config.GUILD_ID })
})

// register commands when added to a server
client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id })
})

// article says "Run corresponding command when new user interaction has been created"
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }
  const { commandName } = interaction
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction)
  }
})

const triggers = ["utafor", "utenfor", "utfor", "utaforr", "utenforr"]

// notice when people are outside
client.on("messageCreate", (message) => {
  if (message.author.bot) return
  if (message.channelId !== config.CHANNEL_ID) return

  const messageIncludesOutside = triggers.some((trigger) =>
    message.content.toLowerCase().includes(trigger),
  )
  if (!messageIncludesOutside) return

  fs.writeFileSync("./last_message_id.txt", randomUUID())
})

client.login(config.DISCORD_TOKEN)

// express api
const app: Express = express()

app.get("/", (req: Request, res: Response) => {
  const status = fs.readFileSync("./last_message_id.txt").toString()
  res.send(status)
})

app.listen(4000)
