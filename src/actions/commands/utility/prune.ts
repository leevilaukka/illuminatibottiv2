import Command from "../../../types/IlluminatiCommand"

const command: Command = {
    name: 'prune',
    aliases: ['poista'],
    description: 'Poista jopa 99 viestiä.',
    args: true,
    usage: '<määrä>',
    category: "general",
    cooldown: 5,
    enableSlash: true, 
    options: [{
        name: "count",
        type: "INTEGER",
        description: "Poistettavien viestien määrä",
        required: true
    }],
    execute(message, args: any, client, settings, interaction) {
        const amount = parseInt(args[0]) + 1;
        const sender = interaction || message
        
        if (isNaN(amount)) {
            return sender.reply('tuo ei taida olla oikea luku.');
        } else if (amount <= 1 || amount > 100) {
            return sender.reply('anna luku 1 ja 99 väliltä.');
        }
        
        sender.channel.bulkDelete(amount, true).catch((err: any) => {
            console.error(err);
            sender.channel.send('tapahtui virhe!');
        });
    },
};

export default command

