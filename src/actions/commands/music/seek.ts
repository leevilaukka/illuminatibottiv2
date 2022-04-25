import Command, { Categories } from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'seek',
    run(message, args, settings, client, meta) {
        const [time] = args 
        if (!time) return message.channel.send('Please provide a time to seek to.')

        const queue = client.player.getQueue(message.guild)
        if (!queue) return message.channel.send('There is no music playing.')

        queue.seek(parseInt(time))
    }
}

export default command