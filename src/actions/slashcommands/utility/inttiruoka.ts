import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";
import Parser from "rss-parser";
import { IlluminatiEmbed } from "../../../structures";

const parseContentSnippet = (contentSnippet: string) => {
    const lines = contentSnippet.split("\n");
    const filteredLines = lines.filter(line => line !== "");

    const filteredContentSnippet = filteredLines.map(line => {
        const splittedLine = line.split(":");
        const filteredLine = splittedLine.filter(line => line !== "");

        return filteredLine.join(":");
    });

    return filteredContentSnippet;
}


const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("inttiruoka")
        .setDescription("Hae inttiruokaa")
        .addStringOption(option => option.setName("ruoka").setDescription("Maastoruoka, varusmiesruoka tai henkilöstölounas")
        .setChoices(
            {name: "Maastoruoka", value: "Maastoruoka"},
            {name: "Varusmiesruoka", value: "Varusmiesruoka"},
            {name: "Henkilöstölounas", value: "Henkilöstölounas"}
        )
        .setRequired(true))
        .toJSON(),
    async execute(client, interaction) {
        const url = "http://ruokalistat.leijonacatering.fi/rss/2/1/65071957-f813-e511-892b-78e3b50298fc"
        const parser = new Parser();

        const response = await parser.parseURL(url);

        const items = response.items;

        const embed = new IlluminatiEmbed(interaction, client)

        embed.setTitle("Inttiruokalista")
        embed.setDescription("Tässä on inttiruokalista")

        const ruoka = interaction.options.getString("ruoka");

        items.filter(item => item.title.includes(ruoka)).forEach(item => {
            const newPage = new IlluminatiEmbed(interaction, client);
            newPage.setTitle(item.title);
            newPage.setDescription(parseContentSnippet(item.contentSnippet).join("\n"));

            embed.addPage(newPage);
        });        
            
        embed.send();
    }
}

export default command;