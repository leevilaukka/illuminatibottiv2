import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";
import Parser from "rss-parser";
import { IlluminatiEmbed } from "../../../structures";
import moment from "moment";

// Parse content snippet to embed description, seperate lines with new line based on newLineStrings
function parseContentSnippet(content: string) {
    const newLineStrings = [
        "Aamiainen:",
        "Lounas:",
        "Päivällinen:",
        "Iltapala:",
    ];

    const contentArray = content.split(new RegExp(newLineStrings.join("|"), "g"));

    console.log(contentArray);
    
    let description = "";

    contentArray.shift();

    contentArray.forEach((item, index) => {
        description += `**${newLineStrings[index]}**\n${item}\n\n`;
    });

    return description;
}

const restaurants = [
    {
        name: "Rokka (Hamina)",
        value: "a5cbc816-f813-e511-892b-78e3b50298fc"
    },
    {
        name: "Linna (Vekaranjärvi)",
        value: "25b3a8ba-f813-e511-892b-78e3b50298fc"
    },
    {
        name: "Ruben (Parola)",
        value: "65071957-f813-e511-892b-78e3b50298fc"
    },
    {
        name: "Liesi (Riihimäki)",
        value: "95b4bc5d-f813-e511-892b-78e3b50298fc"
    },
]

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("inttiruoka")
        .setDescription("Hae inttiruokaa")
        .addStringOption(option => option.setName("ravintola").setDescription("Ravintola").setRequired(true).addChoices(...restaurants))
        .addStringOption(option => option.setName("ruoka").setDescription("Maastoruoka, varusmiesruoka tai henkilöstölounas")
        .setChoices(
            {name: "Maastoruoka", value: "Maastoruoka"},
            {name: "Varusmiesruoka", value: "Varusmiesruoka"},
        )
        .setRequired(true))
        .toJSON(),
    async execute(client, interaction) {
        const ravintola = interaction.options.getString("ravintola");
        const url = `http://ruokalistat.leijonacatering.fi/rss/2/1/${ravintola}`
        const parser = new Parser();

        const response = await parser.parseURL(url);

        const items = response.items;

        const embed = new IlluminatiEmbed(interaction, client)

        embed.setTitle(response.title);
        embed.setURL(response.link);  
        embed.setDescription(`Ruokalista viikolle ${moment().week()} \n
        \`\`\`VL - Vähälaktoosinen, L - Laktoositon, M - Maidoton, G - Gluteeniton, SY - Sydänmerkki-ruoka\n\nHenkilökunnalta saat lisätietoja tarjottavista ruoista ja niiden soveltuvuuksista eri ruokavalioihin.\n\nLeijona Catering varaa oikeuden muutoksiin ruokalistassa.\`\`\``);

        const ruoka = interaction.options.getString("ruoka");

        if (!items.length) return interaction.reply({content: "Ei ruokaa!", ephemeral: true});

        items.filter(item => item.title.includes(ruoka)).forEach(item => {
            const newPage = new IlluminatiEmbed(interaction, client);
            newPage.setTitle(item.title);
            newPage.setDescription(parseContentSnippet(item.contentSnippet));

            embed.addPage(newPage);
        });        
            
        embed.send();
        interaction.reply({content: "Lähetetään viesti", ephemeral: true });
    }
}

export default command;