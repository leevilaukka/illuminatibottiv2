import { MessageActionRow, MessageButton } from 'discord.js'
import { IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'invite',
    async run(message, args, settings, client) {
        const embed = new IlluminatiEmbed(message, client, {
            title: 'Invite me!',
            description: `Add ${client.user.username} to your own server!`,
            thumbnail: {
                url: client.user.displayAvatarURL({ format: 'png', dynamic: true })
            }
        })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("LINK")
                    .setURL(client.botInviteLink)
                    .setLabel('Invite me!'),
            )

        message.reply({embeds: [embed], components: [row]})
    }
}

export default command