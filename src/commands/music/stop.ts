import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'stop',
    execute(message, args, settings, client, interaction) {
        const queue = client.player.getQueue(message.guild)
        
        if (queue) {
            queue.stop()
            return message.reply("Musiikki pysäytetty!")
        }
    }
}
export default command