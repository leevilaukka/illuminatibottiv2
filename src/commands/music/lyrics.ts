import { Lyrics } from '@discord-player/extractor'
import { IlluminatiEmbed } from '../../structures'
import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'lyrics',
    async execute(message, args, settings, client, interaction) {
        const queue = client.player.getQueue(message.guild)

        const {title} = queue.nowPlaying()
        console.log(title)
        if(!title) {
            return message.reply('There is no song currently playing.')
        }
        const lyrics = await client.lyrics.search(title)
        console.log(lyrics)
        
        if(!lyrics) {
            return message.reply('No lyrics found for this song.')
        }

        new IlluminatiEmbed(message, {
            title: `Sanat kappaleelle ${lyrics.title}`,
            url: lyrics.url,
            thumbnail: {url: lyrics.image},
            description: lyrics.lyrics,
            fields: [
                {
                    name: "Artisti",
                    value: lyrics.artist.name
                }
            ]
        }, client).reply()
    }
}
export default command