import { categories } from "../../utils";
import { getCommandCategory } from "../../helpers";
import { IlluminatiEmbed } from "../../structures";

import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: `help`,
    description: `List all of my commands or info about a specific command.`,
    aliases: [`commands`, `apua`],
    usage: `[komento]`,
    cooldown: 5,
    category: "general",
    async execute(message, args: any, settings, client) {

        const {commands} = client;
        const prefix = settings.prefix;

        const author = {
            name: "IlluminatiBotti",
            icon_url: client.user.avatarURL()
        };

        if (!args.length) {
            let fields = [
            ];

            const embed = new IlluminatiEmbed(message, {
                title: `Lista kaikista saatavilla olevista komennoista luokittain:`,
                description: `Voit lähettää \`${prefix}help [komento]\` saadaksesi tietoja tietystä komennosta!`,
                fields,
                author
            }, client);


            // Valmistele komentojen lista
            for (let i = 0; i < categories.length; i++) {
                const categoryLength = commands.filter(command => command.category === categories[i].categoryCode).map(command => command.name).length;
                if(categoryLength !== 0) {
                    fields.push({
                        name: `${categories[i].name} **[${categoryLength}]**:`,
                        value: `${commands.filter(command => command.category === categories[i].categoryCode).map(command => command.name).join(`, `)}`
                    });
                }
            }

            //Lähetä DM
            try {
                await message.author.send({ embed });
                if (message.channel.type === `dm`)
                    return;
                message.reply(`lähetin sinulle DM:n kaikista komennoista!`);
            } catch (error) {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply(`vaikuttaa siltä, etten voi lähettää sinulle yksityisviestejä, ovathan ne käytössä?`);
            }
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        let fields = [
        ];

        if (!command) {
            return message.reply(`tuo ei ole kelpo komento!`);
        }

        fields.push({
            name: `**Nimi:**`,
            value: command.name
        });

        if (command.aliases) fields.push({
            name: `**Aliakset:**`,
            value: `${command.aliases.join(`, `)}`
        });
        if (command.description) fields.push({
            name: `**Kuvaus:**`,
            value: `${command.description}`
        });
        if (command.usage) fields.push({
            name: `**Käyttö:**`,
            value: `${prefix}${command.name} \`${command.usage}\``
        });
        if (command.category) fields.push({
            name: `**Luokka:**`,
            value: `${getCommandCategory(command.category)}`
        });
        fields.push({
            name: `**Cooldown:**`,
            value: `${command.cooldown || 3} sekunti(a)`
        });
        const embed = {
            title: "Tietoja komennosta",
            fields,
            author
        };

        message.channel.send({embed});
    },
};

export default command;