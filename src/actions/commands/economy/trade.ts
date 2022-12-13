import { UserError } from '../../../structures/Errors'
import Command, { Categories } from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'trade',
    args: true,
    aliases: ['give'],
    description: 'Trade with a user',
    usage: "<user> <amount>",
    async run(message, args, settings, client, {user}) {
        const giveTo = message.mentions.users.first()
        const amount = parseInt(args[1])

        if (!giveTo) {
            throw new UserError("Please mention a user.")
        }

        if(isNaN(amount) || amount < 1) {
            throw new UserError("Please specify a valid amount.")
        }

        user.tradeMoney(giveTo, amount, message)
    }
}
export default command