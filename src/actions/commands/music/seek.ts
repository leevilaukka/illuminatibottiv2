import { z } from 'zod'
import { UserError } from '../../../structures/Errors'
import { Command } from '../../../types'
import { Categories } from '../../../types/IlluminatiCommand'

const command: Command<1> = {
    name: 'seek',
    description: 'Seek to a certain time in the song',
    category: Categories.music,
    run(message, args, settings, client, meta) {
        if (meta.queue.metadata.queueHidden) {
            return
        }

        const [time] = args 
        if (!time) throw new UserError('Please provide a time to seek to.')

        const queue = meta.queue
        if (!queue) throw new UserError('There is no music playing.')

        queue.node.seek(Number(time) * 1000)

        return message.reply(`Seeked to ${time} seconds.`)
    }
}

export default command