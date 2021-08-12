import { QueryType } from 'discord-player'
import { argsToString } from '../../helpers'
import { IlluminatiEmbed } from '../../structures'
import Command from '../../types/IlluminatiCommand'
import { PlayerMetadata } from '../../types/PlayerMetadata'

const command: Command = {
    name: 'playlist',
    args: true,
    outOfOrder: true,
    guildOnly: true,
    category: 'music',
    async execute(message, args, settings, client, interaction) {
        const query = argsToString(args)

        client.player.search(query, {
            requestedBy: message.author,
            searchEngine: QueryType.YOUTUBE_PLAYLIST
        }).then(async res => {
            if (!res.playlist) {
                return message.channel.send(`Yhtäkään soittolistaa haulla \`${query}\` ei löytynyt`)
            }

            const embed = await new IlluminatiEmbed(message, {
                title: 'Hakutulokset',
                description: `Löydettiin soittolista ${res.playlist.title}. Aseta soittolista jonoon reagoimalla.`,
                fields: res.playlist.tracks.map((track) => {
                    return {
                        name: `${track.title}`,
                        value: `${track.author}`
                    }
                }),
            }, client).send();

            await embed.react("🎶")
            const filter = (reaction, user) => {
                return reaction.emoji.name === '🎶' && user.id === message.author.id;
            };
            embed.awaitReactions({ filter, max: 1, time: 10000, errors: ['time'] })
                .then(async collected => {
                    const noteCount = collected.get('🎶').count;
                    if (noteCount > 0) {
                        const queue = client.player.getQueue(message.guild)

                        if (queue) {
                            queue.addTracks(res.playlist.tracks)
                            queue.play()
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
                                return message.channel.send('Unable to connect to voice channel.')
                            }
                            
                            queue.addTracks(res.playlist.tracks)
                            queue.play()
                            return collected.first()
                        }
                    }
                })
                .catch(collected => {
                    console.log(`Error`);
                });



        })
    }
}
export default command