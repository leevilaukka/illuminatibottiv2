import { IlluminatiEmbed } from '../../structures'
import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'queue',
    execute(message, args, settings, client, interaction) {
        const queue = client.player.getQueue(message.guild.id)
        if(!queue.tracks.length) return message.channel.send('There is no music playing.')

        const comingUp = queue.tracks.map(track => {
            return {
                name: track.title,
                value: track.author,
            }
        })

        const previousTracks = queue.previousTracks.map(track => {
            return {
                name: track.title,
                value: track.author,
            }
        })


        const embed2 = new IlluminatiEmbed(
            message,
            {
                title: "Edelliset kappaleet",
                description: `${queue.previousTracks.length} kappaletta`,
                fields: previousTracks
            },
            client
        )
        
        new IlluminatiEmbed(message, {
            title: 'Tulossa',
            description: `${queue.tracks.length} kappaletta`,
            fields: comingUp
        }, client).sendMany(queue.previousTracks.length && [embed2], "Jono")
    }
}
export default command