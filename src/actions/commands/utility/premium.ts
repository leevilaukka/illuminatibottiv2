import { Command } from '../../../types'
import { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'premium',
    ownerOnly: true,
    description: 'Give Premium',
    category: Categories.utility,
    run(message, args, settings, client) {
        const mentionUser = client.userManager(message.mentions.users.first())

        if (mentionUser) {
            mentionUser.givePremium()
            return message.reply(`Annettiin premium käyttäjälle ${mentionUser.getDiscordUser().tag}`)
        } else {
            return message.reply("Käyttäjää ei löytynyt!")
        }
    }
}

export default command