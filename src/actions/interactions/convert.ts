import { SlashCommandBuilder } from "@discordjs/builders";
import convert from "convert-units";
import { CommandInteraction } from "discord.js";
import { valueParser } from "../../helpers";
import { IlluminatiInteraction } from "../../types/IlluminatiInteraction";

const data = new SlashCommandBuilder()
    .setName("convert")
    .setDescription("converter")
    .addStringOption(option => option
        .setName("luokka")
        .setDescription("valitse luokka")
        .setRequired(true)
        .addChoices(convert().possibilities().map(measure => [valueParser(measure), measure]))
    ).toJSON()

const interaction: IlluminatiInteraction = {
    data,
    async execute(data: CommandInteraction, client) {
        console.log(data)
    }
}

export default interaction;