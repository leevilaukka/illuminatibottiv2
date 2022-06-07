import { IlluminatiEmbed } from '../../../structures';
import { UserError } from '../../../structures/errors';
import Command, { Categories } from '../../../types/IlluminatiCommand'

enum queueModeEmoji {
    ":x:",
    ":repeat_one:",
    ":repeat:",
    ":infinity: (AutoPlay)"
}

const command: Command = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Sends the currently playing song.',
    category: Categories.music,
    guildOnly: true,
    async run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild)
        const nowPlaying = queue.nowPlaying()

        if (!nowPlaying) throw new UserError('No song playing.')

        new IlluminatiEmbed(message, client, {
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
                    value: queueModeEmoji[queue.repeatMode],
                    inline: true
                },
                {
                    name: "Aikajana",
                    value: queue.createProgressBar()
                }
            ],
        }).send();
    }
}
export default command