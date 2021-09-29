import Command from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'userinfo',
    async execute(message, args, settings, client, {user}) {
        const mentionedUser = message.mentions.users.first()
        if (mentionedUser) {
            return client.userManager(mentionedUser).sendInfo(message, client)
        } else {
            return user.sendInfo(message, client)
        }
    }
}

export default command