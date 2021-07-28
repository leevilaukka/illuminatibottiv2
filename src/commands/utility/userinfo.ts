import { IlluminatiUser } from '../../structures/IlluminatiUser'
import Command from '../../types/IlluminatiCommand'

const command: Command = {
    name: 'userinfo',
    async execute(message, args, settings, client, interaction) {
        const user = <IlluminatiUser>message.mentions.users.first()
        if (user) {
            return user.sendInfo(message, client)
        } else {
            return message.author.sendInfo(message, client)
        }
    }
}

export default command