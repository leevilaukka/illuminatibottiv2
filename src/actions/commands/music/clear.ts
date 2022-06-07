import { UserError } from '../../../structures/errors'
import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'clear',
    category: Categories.music,
    description: 'Clear the music queue',
    guildOnly: true,
    run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild)
        if(queue && queue.tracks.length > 0) {
            queue.clear()
            return message.reply("Jono tyhjennetty!")
        } else {
            throw new UserError("Ei jonoa!")
        }
    }
}
export default command