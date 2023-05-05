import { Command } from '../../../types'
import { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'userinfo',
    description: 'Näyttää tietoja käyttäjästä',
    guildOnly: true,
    category: Categories.utility,
    async run(message, args, settings, client, {user}) {
        const mentionedUser = message.mentions.users.first()
        if (mentionedUser) {
            const embed = await client.userManager(mentionedUser).infoAsEmbed(message, client)
            return embed.send()
        } else {
            const embed = await user.infoAsEmbed(message, client);
            return embed.send()
        }
    }
}

export default command