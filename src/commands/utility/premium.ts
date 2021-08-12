import Command from '../../types/IlluminatiCommand'

const command: Command = {
    name: 'premium',
    ownerOnly: true,
    execute(message, args, settings, client, interaction) {
        const user = message.mentions.users.first()

        if (user) {
            client.userManager.givePremium(user)
            return message.reply(`Annettiin premium käyttäjälle ${user}`)
        } else {
            return message.reply("Käyttäjää ei löytynyt!")
        }
    }
}

export default command