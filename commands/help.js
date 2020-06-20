const categories = require("../utils/categories");

module.exports = {
    name: `help`,
    description: `List all of my commands or info about a specific command.`,
    aliases: [`commands`, `apua`],
    usage: `[komento]`,
    cooldown: 5,
    category: "general",
    execute(message, args, settings, client) {
        const data = [];
        const {commands} = message.client;
        const prefix = settings.prefix;

        if (!args.length) {
            // Valmistele komentojen lista
            data.push(`Lista kaikista saatavilla olevista komennoista luokittain:`);

            for (let i = 0; i < categories.length; i++) {
                console.log(categories[i]);
                const categoryLength = commands.filter(command => command.category === categories[i].categoryCode).map(command => command.name).length;
                if(categoryLength !== 0) {
                    data.push(`${categories[i].name} **[${categoryLength}]**:`);
                    data.push(`${commands.filter(command => command.category === categories[i].categoryCode).map(command => command.name).join(`, `)}\n`);
                }
            }

            data.push(`Voit lähettää \`${prefix}help [komento]\` saadaksesi tietoja tietystä komennosta!`);

            //Lähetä DM
            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === `dm`) return;
                    message.reply(`lähetin sinulle DM:n kaikista komennoista!`);
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(`vaikuttaa siltä, etten voi lähettää sinulle yksityisviestejä, ovathan ne käytössä?`);
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`tuo ei ole kelpo komento!`);
        }

        data.push(`**Nimi:** ${command.name}`);

        const getCommandCategory = (categoryCode) => {
            for (let i = 0; i < categories.length; i++) {
                if(categories[i].categoryCode === categoryCode){
                    return categories[i].name
                }
            }
        };

        if (command.aliases) data.push(`**Aliakset:** ${command.aliases.join(`, `)}`);
        if (command.description) data.push(`**Kuvaus:** ${command.description}`);
        if (command.usage) data.push(`**Käyttö:** ${prefix}${command.name} \`${command.usage}\``);
        if (command.category) data.push(`**Luokka:** ${getCommandCategory(command.category)}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} sekunti(a)`);

        message.channel.send(data, {split: true});
    },
};