import { QueryType } from 'discord-player'
import { Collector, CollectorFilter, CollectorOptions, MessageReaction, User } from 'discord.js'
import { argsToString } from '../../../helpers'
import { IlluminatiEmbed } from '../../../structures'
import Command from '../../../types/IlluminatiCommand'
import { PlayerMetadata } from '../../../types/PlayerMetadata'

const command: Command = {
    name: 'playlist',
    args: true,
    guildOnly: true,
    category: 'music',
    async execute(message, args, settings, client) {
        const query = argsToString(args)

        client.player.search(query, {
            requestedBy: message.author,
        }).then(async res => {
            if (!res.playlist) {
                return message.channel.send(`Yhtäkään soittolistaa haulla \`${query}\` ei löytynyt`)
            }

            const queue = client.player.getQueue(message.guild)

            if (queue) {
                queue.addTracks(res.playlist.tracks)
                queue.play()
            } else {
                const metadata: PlayerMetadata = {
                    channel: message.channel,
                    author: message.author,
                    message,
                }
                
                const queue = client.player.createQueue(message.guild, {
                    metadata
                })

                try {
                    if (!queue.connection) await queue.connect(message.member.voice.channel)
                } catch (e) {
                    queue.destroy()
                    return message.channel.send('Unable to connect to voice channel.')
                }

                queue.addTracks(res.playlist.tracks)
                queue.play()
            }
        })
    }
}
export default command