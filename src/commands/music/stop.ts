import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'stop',
    execute(message, args, settings, client, interaction) {
        client.player.getQueue(message.guild).stop()
        return message.reply("Musiikki pysäytetty!")
    }
}
export default command