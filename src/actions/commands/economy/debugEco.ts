import { UserError } from "../../../structures/Errors";
import { Command } from "../../../types";

const command: Command = {
    name: 'debugeco',
    ownerOnly: true,
    description: 'Debugging economy',
    aliases: ["de"],
    category: "economy",
    run(message, args, settings, client, { user }) {
        const amount = args[0]
        
        if (!amount) {
            throw new UserError(`Please specify an amount to add.`)
        }

        const parsed = parseInt(amount)

        if (isNaN(parsed)) {
            throw new UserError(`Amount must be a number.`)
        }

        user.addMoney(parsed)
        return message.channel.send(`You have successfully added ${amount} to your account.`)
    }
}
export default command