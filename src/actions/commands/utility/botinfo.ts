import { IlluminatiClient, IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from '../../../types/IlluminatiCommand'
import { MessageActionRow, MessageButton } from 'discord.js'

const command: Command = {
    name: 'botinfo',
    async run(message, args, settings, client) {
        const owner = await client.getOwner()
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

        

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setURL(client.botInviteLink)    
                    .setLabel('Invite Link'),
                new MessageButton()
                    .setStyle('LINK')
                    .setURL(IlluminatiClient.packageInfo.homepage)
                    .setLabel('GitHub Repository'),
                new MessageButton()
                    .setStyle('LINK')
                    .setURL(IlluminatiClient.packageInfo.author.url)
                    .setLabel('GitHub Profile'),
            )

        message.reply({embeds: [embed], components: [row]})
    }
}

export default command