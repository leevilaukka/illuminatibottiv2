import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'clear',
    execute(message, args, settings, client, interaction) {
        const queue = client.player.getQueue(message.guild)
        if(queue && queue.tracks.length > 0) {
            queue.clear()
            return message.reply("Jono tyhjennetty!")
        } else {
            return message.reply("Ei jonoa")
        }
    }
}
export default command