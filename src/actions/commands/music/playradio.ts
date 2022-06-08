import Command from 'IlluminatiCommand'

import { argsToString } from '../../../helpers';
import { PlayerMetadata } from 'PlayerMetadata';
import { PlayerError } from '../../../structures/Errors';

const command: Command = {
    name: 'playradio',
    outOfOrder: true,
    async run(message: any, args, settings, client) {
        if (!message.member.voice.channelId) {
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
            throw new PlayerError('Ei voida yhdistää puhekanavaan.', queue.player)
        }

        const track = await client.player.search(argsToString(args), {
            requestedBy: message.author,
        }).then(x => x.tracks[0])

        client.player.unuse("Radio")

        queue.play(track)
    }
}

export default command