import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'skip',
    description: 'Skip the current song',
    aliases: ['s'],
    category: 'music',
    guildOnly: true,
    execute(message, args, settings, client) {
        client.player.getQueue(message.guild).skip()
    }
}
export default command