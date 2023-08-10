import { z } from 'zod'
import { UserError } from '../../../structures/Errors'
import { Command } from '../../../types'
import { Categories } from '../../../types/IlluminatiCommand'

type Args = z.infer<typeof schema>

const schema = z.object({
    args: z.tuple([z.number()])
})

const command: Command = {
    name: 'seek',
    description: 'Seek to a certain time in the song',
    category: Categories.music,
    evalSchema: schema,
    run(message, args: Args["args"], settings, client, meta) {
        const [time] = args 
        if (!time) throw new UserError('Please provide a time to seek to.')

        const queue = meta.queue
        if (!queue) throw new UserError('There is no music playing.')

        queue.node.seek(time * 1000)

        return message.reply(`Seeked to ${time} seconds.`)
    }
}

export default command