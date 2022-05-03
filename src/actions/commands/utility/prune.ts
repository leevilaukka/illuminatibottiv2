import { Message, TextChannel } from "discord.js";
import Command, { Categories } from "../../../types/IlluminatiCommand" 
import wait from "../../../utils/wait";

export default {
    name: 'prune',
    aliases: ['poista'],
    description: 'Poista jopa 99 viestiä.',
    args: true,
    usage: '<määrä>',
    category: Categories.general,
    cooldown: 5,
    outOfOrder: true,
    guildOnly: true,
    run(message, args, _settings, _client) {
        const amount = parseInt(args[0]) + 1;
        
        if (isNaN(amount)) {
            return message.reply('tuo ei taida olla oikea luku.');
        } else if (amount <= 1 || amount > 100) {
            return message.reply('anna luku 1 ja 99 väliltä.');
        }
        const channel = message.channel as TextChannel;

        channel.bulkDelete(amount, true).catch((err: any) => {
            console.error(err);
            message.channel.send('tapahtui virhe!');
        }).then(() => {
            message.channel.send(`poistettu ${amount - 1} viestiä.`).then(async msg => wait(5000).then(() => msg.delete()));
        });
    },
} as Command;
