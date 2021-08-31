import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'trade',
    args: true,
    description: 'Trade with a user',
    usage: "<user> <amount>",
    execute(message, args: string[], settings, client) {
        const sendTo = message.mentions.users.first()
        const amount = parseInt(args[1])

        client.userManager.tradeMoney(message.author, sendTo, amount, message)
    }
}
export default command