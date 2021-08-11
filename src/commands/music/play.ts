import { argsToString } from '../../helpers'
import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'play',
    async execute(message, args, settings, client, interaction) {
        if(!message.member.voice.channelId) {
            return message.channel.send('You must be in a voice channel to use this command.')
        }

        const query = argsToString(args)
        const queue = client.player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
                author: message.author,
                message
            }
        })

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel)
        } catch (e) {
            queue.destroy()
            return message.channel.send('Unable to connect to voice channel.')
        }

        const track = await client.player.search(query, {
            requestedBy: message.author   
        }).then(x => x.tracks[1]);

        if(!track) return message.channel.send('No tracks found.')
        queue.play(track)
    }
}
export default command