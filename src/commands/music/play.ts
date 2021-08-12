import { QueryType } from 'discord-player'
import { argsToString } from '../../helpers'
import Command from '../../types/IlluminatiCommand'
import {PlayerMetadata} from '../../types/PlayerMetadata'

const command: Command = {
    name: 'play',
    aliases: ['p'],
    async execute(message, args, settings, client, interaction) {
        if(!message.member.voice.channelId) {
            return message.channel.send('Et ole puhekanavalla!')
        }

        const query = argsToString(args)

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
            return message.channel.send('Ei voida yhdistää puhekanavaan.')
        }

        const track = await client.player.search(query, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        }).then(x => x.tracks[0])
        .catch(e => {
            console.error(e)
        });

        if(!track) return message.reply('No tracks found.')
        queue.play(track)
    }
}
export default command