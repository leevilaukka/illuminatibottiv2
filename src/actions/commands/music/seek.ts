import Command from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'seek',
    execute(message, args, settings, client, meta) {
        const [time] = args as number[]
        if (!time) return message.channel.send('Please provide a time to seek to.')

        const queue = client.player.getQueue(message.guild)
        if (!queue) return message.channel.send('There is no music playing.')

        queue.seek(time)
    }
}

export default command