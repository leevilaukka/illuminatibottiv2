import Command from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'userinfo',
    async execute(message, args, settings, client, interaction) {
        const user = message.mentions.users.first()
        if (user) {
            return client.userManager.sendInfo(user, message, client)
        } else {
            return client.userManager.sendInfo(message.author, message, client)
        }
    }
}

export default command