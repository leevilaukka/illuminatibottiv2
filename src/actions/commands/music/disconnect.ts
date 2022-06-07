import { UserError } from '../../../structures/errors'
import Command, { Categories } from '../../../types/IlluminatiCommand'


const command: Command = {
    name: 'disconnect',
    category: Categories.music,
    description: 'Disconnect from the voice channel',
    aliases: ['dc', 'leave'],
    guildOnly: true,
    run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild)

        if (queue) {
            queue.destroy(true)
            return message.reply("Heippa!")
        } else {
            throw new UserError("Mikään ei soi!")
        }
    }
}
export default command