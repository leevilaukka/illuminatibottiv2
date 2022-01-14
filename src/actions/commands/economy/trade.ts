import Command ,{ Categories } from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'trade',
    args: true,
    description: 'Trade with a user',
    usage: "<user> <amount>",
    run(message, args: string[], settings, client, {user}) {
        const giveTo = message.mentions.users.first()
        const amount = parseInt(args[1])

        user.tradeMoney(giveTo, amount, message)
    }
}
export default command