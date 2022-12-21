import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentBuilder} from 'discord.js'
import { Button } from '../../../helpers/interactions'
import { IlluminatiClient, IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'botinfo',
    aliases: ['bi', 'bot', 'info'],
    description: 'Shows bot info',
    category: Categories.utility,
    async run(message, args, settings, client) {
        const owner = await client.owner
        const embed = new IlluminatiEmbed(message, client, {
            title: 'Bot Information',
            thumbnail: {
                url: client.user.displayAvatarURL(),
            },
            fields: [
                {
                    name: 'Bot Name',
                    value: client.user.username,
                    inline: true
                },
                {
                    name: 'Bot Tag',
                    value: client.user.tag,
                    inline: true
                },
                {
                    name: 'Bot Owner',
                    value: owner.tag,
                    inline: true
                },
                {
                    name: 'Bot Prefix',
                    value: settings.prefix,
                    inline: true
                },
                {
                    name: 'Bot Version',
                    value: `v${IlluminatiClient.packageInfo.version}${client.isDevelopment ? '-dev' : ''}`,
                    inline: true
                },
                {
                    name: 'Bot Servers',
                    value: client.guilds.cache.size.toString(),
                    inline: true
                },
                {
                    name: 'Bot Channels',
                    value: client.channels.cache.size.toString(),
                    inline: true
                },
                {
                    name: 'Bot Users',
                    value: client.users.cache.size.toString(),
                    inline: true
                },
            ]
        })

        


        message.reply({embeds: [embed]})
    }
}

export default command