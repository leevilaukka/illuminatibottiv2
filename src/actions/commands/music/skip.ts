import Command, { Categories } from '../../../types/IlluminatiCommand'


const command: Command = {
    name: 'skip',
    description: 'Skip the current song',
    aliases: ['s'],
    category: Categories.music,
    guildOnly: true,
    run(message, args, settings, client) {
        client.player.getQueue(message.guild).skip()
    }
}
export default command