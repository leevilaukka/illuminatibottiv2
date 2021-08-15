import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'stop',
    description: 'Stop the music',
    guildOnly: true,
    category: 'music',
    execute(message, args, settings, client, interaction) {
        const queue = client.player.getQueue(message.guild)
        
        if (queue) {
            queue.stop()
            return message.reply("Musiikki pysäytetty!")
        }
    }
}
export default command