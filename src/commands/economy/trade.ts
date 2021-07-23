import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'trade',
    args: true,
    description: 'Trade with a user',
    usage: "<user> <amount>",
    execute(message, args: number[], settings, client, interaction) {
        const amount = args[1]
        const sendTo = message.mentions.users.first()

        message.author.tradeMoney(sendTo, amount, message)
    }
}
export default command