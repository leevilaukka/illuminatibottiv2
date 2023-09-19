import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
import { IlluminatiClient, IlluminatiEmbed } from "../../../structures";
import { ChannelType } from "discord.js";

const command: Command = {
    name: `help`,
    description: `List all of my commands or info about a specific command.`,
    aliases: [`commands`, `apua`],
    usage: `[komento]`,
    cooldown: 5,
    category: Categories.general,
    async run(message, args, settings, client) {
        const { commands, getCommand } = IlluminatiClient;
        const { prefix } = settings;

        if (!args.length) {
            let fields = [];

            // Valmistele komentojen lista
            for (const [_category, value] of Object.entries(Categories)) {
                const commandsInCategory = commands.filter(
                    (cmd) => cmd.category === value
                );
                if ([...commandsInCategory].length) {
                    fields.push({
                        name: `${value[0].toUpperCase()}${value.slice(1)} [${
                            [...commandsInCategory].length
                        }]`,
                        value: commandsInCategory
                            .map((cmd) => `\`${cmd.name}\``)
                            .join(", "),
                    });
                }
            }

            const embed = new IlluminatiEmbed(message, client, {
                title: `Lista kaikista saatavilla olevista komennoista luokittain:`,
                description: `Voit lähettää \`${prefix}help [komento]\` saadaksesi tietoja tietystä komennosta! \n\n Komentoja on yhteensä ${commands.size}.`,
                fields
            });

            //Lähetä DM
            try {
                await message.author.send({ embeds: [embed] });
                if (message.channel.type === ChannelType.DM) return;
                return message.reply(
                    `lähetin sinulle DM:n kaikista komennoista!`
                );
            } catch (error) {
                console.error(
                    `Could not send help DM to ${message.author.tag}.\n`,
                    error
                );
                return message.reply(
                    `vaikuttaa siltä, etten voi lähettää sinulle yksityisviestejä, ovathan ne käytössä?`
                );
            }
        }
        const name = args[0]?.toLowerCase();
        const command = getCommand(name);
        const fields = [];

        if (!command) {
            return message.reply(`tuo ei ole kelpo komento!`);
        }

        fields.push({
            name: `**Nimi:**`,
            value: command.name,
            inline: true,
        });

        if (command.aliases)
            fields.push({
                name: `**Aliakset:**`,
                value: `${command.aliases.join(`, `)}`,
            });
        if (command.description)
            fields.push({
                name: `**Kuvaus:**`,
                value: `${command.description}`,
                inline: true,
            });
        if (command.usage)
            fields.push({
                name: `**Käyttö:**`,
                value: `${prefix}${command.name} \`${command.usage}\``,
                inline: true,
            });
        if (command.category)
            fields.push({
                name: `**Kategoria:**`,
                value: `${command.category[0].toUpperCase()}${command.category.slice(
                    1
                )}`,
                inline: true,
            });
        fields.push({
            name: `**Cooldown:**`,
            value: `${command.cooldown || 3} sekunti${command.cooldown === 1 ? "" : "a"}`,
            inline: true,
        });

        new IlluminatiEmbed(message, client, {
            title: "Tietoja komennosta",
            fields
        }).send();
    },
};

export default command;
