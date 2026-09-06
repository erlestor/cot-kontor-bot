import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Lists possible commands")

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("I have no commands as of yet")
}
