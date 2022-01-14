import Command, { Categories } from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'userinfo',
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