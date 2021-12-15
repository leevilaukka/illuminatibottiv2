import Command from '../../../types/IlluminatiCommand'

import { myExtractor } from '../../../bot';
import { argsToString } from '../../../helpers';
import { PlayerMetadata } from '../../../types/PlayerMetadata';

const command: Command = {
    name: 'playradio',
    outOfOrder: true,
    async execute(message: any, args, settings, client) {
        if(!message.member.voice.channelId) {
            return message.channel.send('Et ole puhekanavalla!')
        } 
        
        const metadata: PlayerMetadata = {
            channel: message.channel,
            message,
            author: message.author,
            
        }

        const queue =  client.player.getQueue(message.guild) || client.player.createQueue(message.guild, {
            metadata
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel)
        } catch (e) {
            queue.destroy()
            return message.channel.send('Ei voida yhdistää puhekanavaan.')
        }


        client.player.use("Radio", myExtractor)

        const track = await client.player.search(argsToString(args), {
            requestedBy: message.author,
        }).then(x => x.tracks[0])

        client.player.unuse("Radio")

        queue.play(track)
    }
}

export default command