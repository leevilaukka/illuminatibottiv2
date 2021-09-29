import Command from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'premium',
    ownerOnly: true,
    execute(message, args, settings, client, user) {
        const mention = message.mentions.users.first()

        if (user) {
            client.userManager(mention).givePremium()
            return message.reply(`Annettiin premium käyttäjälle ${user}`)
        } else {
            return message.reply("Käyttäjää ei löytynyt!")
        }
    }
}

export default command