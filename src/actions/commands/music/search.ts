import { Message, MessageCollector } from 'discord.js'
import { argsToString } from '../../../helpers'
import { IlluminatiEmbed } from '../../../structures'
import { PlayerError, UserError } from '../../../structures/Errors'
import Command, { Categories } from '../../../types/IlluminatiCommand'
import { PlayerMetadata } from '../../../types/PlayerMetadata'


const command: Command = {
    name: 'search',
    description: 'Search for a song',
    args: true,
    category: Categories.music,
    aliases: ['ms'],
    guildOnly: true,
    async run(message, args, settings, client) {
        const query = argsToString(args)

        client.player.search(query, {
            requestedBy: message.author
        }).then(async res => {
            if (res.tracks.length === 0) {
                return message.channel.send(`Yhtäkään kappaletta haulla \`${query}\` ei löytynyt`)
            }

            const embed = new IlluminatiEmbed(message, client, {
                title: 'Hakutulokset',
                description: `Löydettiin \`${res.tracks.length}\` tulosta haulle \`${query}\``,
                fields: res.tracks.map((track, index) => {
                    return {
                        name: `\`${index + 1}\` | ${track.title}`,
                        value: `${track.author}`
                    }
                }),
            })

            const sentEmbed = await message.channel.send({ embeds: [embed] })

            const filter = (m: Message) => {
                const author = m.author.id === message.author.id
                const parsed = parseInt(m.content) <= res.tracks.length
                console.log("Filter: ", author, parsed)
                return author && parsed
            }

            message.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] })
                .then(async collected => {
                    console.log(collected)
                    const trackIdx = parseInt(collected.first().content.trim()) - 1
                    const queue = client.player.getQueue(message.guild)

                    if (queue) {
                        queue.play(res.tracks[trackIdx])
                    } else {
                        const metadata: PlayerMetadata = {
                            channel: message.channel,
                            author: message.author,
                            message,
                            command: this
                        }

                        const queue = client.player.createQueue(message.guild, {
                            metadata
                        })

                        try {
                            if (!queue.connection) await queue.connect(message.member.voice.channel)
                        } catch (e) {
                            queue.destroy()
                            throw new PlayerError('Unable to connect to voice channel.', queue.player)
                        }

                        await queue.play(res.tracks[trackIdx])
                        return collected.first()
                    }
                })
                .then(async (collected) => {
                    await collected.delete()
                    await sentEmbed.delete()
                    await message.delete()
                })
                .catch(collected => { throw new UserError(`After a minute, only ${collected.size} out of 4 voted.`) });
        })
    }
}
export default command