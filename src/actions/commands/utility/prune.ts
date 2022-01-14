import Command, { Categories } from "../../../types/IlluminatiCommand"

const command: Command = {
    name: 'prune',
    aliases: ['poista'],
    description: 'Poista jopa 99 viestiä.',
    args: true,
    usage: '<määrä>',
    category: Categories.general,
    cooldown: 5,
    outOfOrder: true,
    run(message, args: any, _settings, _client) {
        const amount = parseInt(args[0]) + 1;
        
        if (isNaN(amount)) {
            return message.reply('tuo ei taida olla oikea luku.');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('anna luku 1 ja 99 väliltä.');
        }
        
        /*message.channel.bulkDelete(amount, true).catch((err: any) => {
            console.error(err);
            message.channel.send('tapahtui virhe!');
        });*/
    },
};

export default command

