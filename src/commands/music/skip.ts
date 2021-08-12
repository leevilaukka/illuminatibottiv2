import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'skip',
    description: 'Skip the current song',
    aliases: ['s'],
    execute(message, args, settings, client, interaction) {
        client.player.getQueue(message.guild).skip()
    }
}
export default command