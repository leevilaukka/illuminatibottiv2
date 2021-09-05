import { MessageActionRow, MessageButton } from 'discord.js'
import { IlluminatiEmbed } from '../../../structures'
import Command from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'invite',
    async execute(message, args, settings, client) {
        const embed = new IlluminatiEmbed(message, client, {
            title: 'Kutsu botti!',
            description: `Lisää ${client.user.username} omalle palvelimellesi!`,
            thumbnail: {
                url: client.user.displayAvatarURL({ format: 'png', dynamic: true })
            }
        })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("LINK")
                    .setURL(await client.getBotInviteLink())
                    .setLabel('Kutsu botti!'),
            )

        message.reply({embeds: [embed], components: [row]})
    }
}

export default command