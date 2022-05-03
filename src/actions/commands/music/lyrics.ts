import { IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from 'IlluminatiCommand'

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
            return message.reply('There is no song currently playing.')
        }
        const lyrics = await client.lyrics.search(title)
        console.log(lyrics)
        
        if(!lyrics) {
            return message.reply('No lyrics found for this song.')
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