import { BotError, UserError } from '../../../structures/Errors';
import { QueryType } from 'discord-player'
import { argsToString } from '../../../helpers'
import { Command } from '../../../types'
import { Categories } from '../../../types/IlluminatiCommand'
import { PlayerMetadata } from '../../../types/PlayerMetadata'

// TODO optimize
const command: Command = {
    name: 'play',
    aliases: ['p'],
    description: 'Plays a song',
    category: Categories.music,
    guildOnly: true,
    async run(message, args, _settings, client, _meta) {
        if(!message.member.voice.channelId) {
            throw new UserError("Et ole puhekanavalla!")
        }

        const metadata: PlayerMetadata = {
            channel: message.channel,
            message,
            author: message.author,
            command: this
        }

        // Create or get queue
        const queue = client.player.getQueue(message.guild) || client.player.createQueue(message.guild, {
            metadata
        });

        // Connect Queue to voice channel
        if(!queue.connection) {
            try {
                await queue.connect(message.member.voice.channel)
            } catch (e) {
                queue.destroy()
                throw new Error("Ei voitu yhdistää puhekanavaan")
            }
        }


        // Get track
        const track = await client.player.search(argsToString(args), {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        })
            .then(x => x.tracks[0])
            .catch(e => {
                console.error(e)
                return
            });
        
        if(!track) throw new BotError("Kappaletta ei löytynyt")
        queue.play(track)
    }
}
export default command