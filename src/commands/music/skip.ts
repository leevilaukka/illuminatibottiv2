import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'skip',
    execute(message, args, settings, client, interaction) {
        client.player.getQueue(message.guild).skip()
    }
}
export default command