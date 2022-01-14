import { QueryType } from 'discord-player'
import { argsToString } from '../../../helpers'
import Command, { Categories } from '../../../types/IlluminatiCommand'
import { PlayerMetadata } from '../../../types/PlayerMetadata'

// TODO optimize
const command: Command = {
    name: 'play',
    aliases: ['p'],
    description: 'Plays a song',
    category: Categories.music,
    guildOnly: true,
    async run(message, args, settings, client, meta) {
        if(!message.member.voice.channelId) {
            return message.channel.send('Et ole puhekanavalla!')
        }

        const metadata: PlayerMetadata = {
            channel: message.channel,
            message,
            author: message.author,
        }

        const queue = client.player.getQueue(message.guild) || client.player.createQueue(message.guild, {
            metadata
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel)
        } catch (e) {
            queue.destroy()
            return message.channel.send('Ei voida yhdistää puhekanavaan.')
        }

        const track = await client.player.search(argsToString(args), {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        }).then(x => x.tracks[0])
        .catch(e => {
            console.error(e)
        });

        if(!track) return message.reply('No tracks found.')
        queue.play(track)
        return true
    }
}
export default command