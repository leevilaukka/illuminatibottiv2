import { EmbedBuilder } from 'discord.js'
import { IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'queue',
    aliases: ['q'],
    description: 'Näytä nykyinen jono',
    category: Categories.music,
    guildOnly: true,
    async run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild.id)

        const comingUp = queue.tracks.map(track => {
            return {
                name: track.title,
                value: track.author,
            }
        })
        
        const embed = new EmbedBuilder()
            .setTitle('Jono')
            .setDescription(`Nyt soi: ${queue.nowPlaying().title}`)
            .addFields(comingUp)
            .setThumbnail(queue.nowPlaying().thumbnail)
            .setFooter({
                text: `Kappaleita jonossa: ${queue.tracks.length}`
            })

        return message.channel.send({ embeds: [embed] })
    }
}
export default command