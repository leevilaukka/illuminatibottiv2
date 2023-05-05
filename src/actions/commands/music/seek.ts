import { UserError } from '../../../structures/Errors'
import { Command } from '../../../types'
import { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'seek',
    run(message, args, settings, client, meta) {
        const [time] = args 
        if (!time) throw new UserError('Please provide a time to seek to.')

        const queue = client.player.getQueue(message.guild)
        if (!queue) throw new UserError('There is no music playing.')

        queue.seek(parseInt(time))

        return message.reply(`Seeked to ${time} seconds.`)
    }
}

export default command