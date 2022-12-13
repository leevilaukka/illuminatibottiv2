import Command, { Categories } from '../../../types/IlluminatiCommand'
import { blackjack } from 'discord.js-games';


const command: Command = {
    name: "blackjack",
    description: "Blackjack",
    category: Categories.other,
    outOfOrder: true,
    async run(message, args, settings, client) {
    
    }
};

export default command