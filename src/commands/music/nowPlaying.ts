import { IlluminatiEmbed } from '../../structures';
import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Sends the currently playing song.',
    execute(message, args, settings, client, interaction) {
        const queue = client.player.getQueue(message.guild)
        const nowPlaying = queue.nowPlaying()

        const queueModeResolver = [
            ":x:",
            ":repeat_one:",
            ":repeat:",
            ":infinity: (AutoPlay)"
        ]

        new IlluminatiEmbed(message, {
            title: `Nyt soi: ${nowPlaying.title}`,
            url: nowPlaying.url,
            thumbnail: { url: nowPlaying.thumbnail },
            fields: [
                {
                    name: "Kanava",
                    value: nowPlaying.author
                },
                {
                    name: "Kesto",
                    value: nowPlaying.duration,
                    inline: true
                },
                {
                    name: "Näyttökerrat",
                    value: nowPlaying.views.toString(),
                    inline: true
                },
                {
                    name: "Toistotila",
                    value: queueModeResolver[queue.repeatMode],
                    inline: true
                },
                {
                    name: "Aikajana",
                    value: queue.createProgressBar()
                }
            ],
        }, client).send();
    }
}
export default command