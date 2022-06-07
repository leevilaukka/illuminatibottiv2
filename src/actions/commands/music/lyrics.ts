import { IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from "../../../types/IlluminatiCommand";
import { BotError, UserError } from '../../../structures/errors'

const command: Command = {
    name: 'lyrics',
    aliases: ['lyric'],
    description: 'Searches for lyrics.',
    guildOnly: true,
    category: Categories.music,
    async run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild)

        const { title } = queue.nowPlaying() as { title: string }

        if(!title) {
            throw new UserError('No song playing.')
        }
        const lyrics = await client.lyrics.search(title)
        console.log(lyrics)
        
        if(!lyrics) {
            throw new BotError('No lyrics found.')
        }

        return new IlluminatiEmbed(message, client, {
            title: `Sanat kappaleelle ${lyrics.title}`,
            url: lyrics.url,
            thumbnail: { url: lyrics.image },
            description: lyrics.lyrics,
            fields: [
                {
                    name: "Artisti",
                    value: lyrics.artist.name
                }
            ]
        }).reply()
    }
}
export default command