module.exports = {
    name: 'prune',
    aliases: ['poista'],
    description: 'Poista jopa 99 viestiä.',
    args: true,
    usage: '<määrä>',
    category: "general",
    cooldown: 5,
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('tuo ei taida olla oikea luku.');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('anna luku 1 ja 99 väliltä.');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('tapahtui virhe!');
        });
    },
};