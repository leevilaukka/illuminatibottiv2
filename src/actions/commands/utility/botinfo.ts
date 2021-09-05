import { IlluminatiEmbed } from '../../../structures'
import Command from '../../../types/IlluminatiCommand'

import {version, author, homepage} from '../../../../package.json'
import { MessageActionRow, MessageButton } from 'discord.js'

const command: Command = {
    name: 'botinfo',
    async execute(message, args, settings, client) {
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
                    value: (await client.getOwner()).tag,
                    inline: true
                },
                {
                    name: 'Bot Prefix',
                    value: settings.prefix,
                    inline: true
                },
                {
                    name: 'Bot Version',
                    value: version,
                    inline: true
                },
                {
                    name: 'Bot Language / Library',
                    value: 'Typescript / Discord.js',
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

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setURL(await client.getBotInviteLink())    
                    .setLabel('Invite Link'),
                new MessageButton()
                    .setStyle('LINK')
                    .setURL(homepage)
                    .setLabel('GitHub Repository'),
                new MessageButton()
                    .setStyle('LINK')
                    .setURL(author.url)
                    .setLabel('GitHub Profile'),
            )

        message.reply({embeds: [embed], components: [row]})
    }
}

export default command