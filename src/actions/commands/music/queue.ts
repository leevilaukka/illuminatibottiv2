import { IlluminatiEmbed } from '../../../structures'
import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'queue',
    aliases: ['q'],
    description: 'Näytä nykyinen jono',
    category: 'music',
    guildOnly: true,
    execute(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild.id)

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
            client,
            {
                title: "Edelliset kappaleet",
                description: `${queue.previousTracks.length} kappale${queue.previousTracks.length > 1 ? "tta": ""}`,
                fields: previousTracks
            },
        )
        
        new IlluminatiEmbed(message, client, {
            title: 'Tulossa',
            description: `${queue.tracks.length} kappale${queue.tracks.length > 1 ? "tta": ""}`,
            fields: comingUp
        }).sendMany(queue.previousTracks.length && [embed2], "Jono")
    }
}
export default command