import { argsToString } from '../../../helpers'
import { PlayerError } from '../../../structures/errors'
import Command, { Categories } from '../../../types/IlluminatiCommand'
import { PlayerMetadata } from '../../../types/PlayerMetadata'

const command: Command = {
    name: 'playlist',
    args: true,
    guildOnly: true,
    category: Categories.music,
    async run(message, args, settings, client) {
        const query = argsToString(args)

        client.player.search(query, {
            requestedBy: message.author,
        }).then(async res => {
            if (!res.playlist) {
                throw new Error(`Yhtäkään soittolistaa haulla \`${query}\` ei löytynyt`)
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
                    throw new PlayerError("Ei voitu yhdistää puhekanavaan")
                }

                queue.addTracks(res.playlist.tracks)
                queue.play()
            }
        })
    }
}
export default command