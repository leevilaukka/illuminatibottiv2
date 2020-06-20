module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands', 'apua'],
    usage: '[komento]',
    cooldown: 5,
    category: "general",
    execute(message, args,settings) {
        const data = [];
        const { commands } = message.client;
        const prefix = settings.prefix;

        if (!args.length) {
            // Valmistele komentojen lista
            data.push('Lista kaikista saatavilla olevista komennoista luokittain:');
            data.push('Yleiset:');
            data.push(commands.filter(command => command.category === "general").map(command => command.name).join(', '));
            data.push('\nMusiikki:');
            data.push(commands.filter(command => command.category === "music").map(command => command.name).join(', '));
            data.push('\nMaps:');
            data.push(commands.filter(command => command.category === "maps").map(command => command.name).join(', '));
            data.push('\nMatematiikka ja yksikkömuunnokset:');
            data.push(commands.filter(command => command.category === "math").map(command => command.name).join(', '));
            data.push('\nAsetukset:');
            data.push(commands.filter(command => command.category === "config").map(command => command.name).join(', '));
            data.push('\nPäivämäärätietoja:');
            data.push(commands.filter(command => command.category === "date").map(command => command.name).join(', '));
            data.push('\nMuut:');
            data.push(commands.filter(command => command.category === "other").map(command => command.name).join(', '));
            if(commands.filter(command => !command.category).length >= 0){
                data.push('\nMäärittelemättömät:');
                data.push(commands.filter(command => !command.category).map(command => command.name).join(', '));
            }
            data.push(`\nVoit lähettää \`${prefix}help [komento]\` saadaksesi tietoja tietystä komennosta!`);

            //Lähetä DM
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('lähetin sinulle DM:n kaikista komennoista!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('vaikuttaa siltä, etten voi lähettää sinulle yksityisviestejä, ovathan ne käytössä?');
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('tuo ei ole kelpo komento!');
        }

        data.push(`**Nimi:** ${command.name}`);

        if (command.aliases) data.push(`**Aliakset:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Kuvaus:** ${command.description}`);
        if (command.usage) data.push(`**Käyttö:** ${prefix}${command.name} \`${command.usage}\``);
        if (command.category) data.push(`**Luokka:** ${command.category}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} sekunti(a)`);

        message.channel.send(data, { split: true });
    },
};