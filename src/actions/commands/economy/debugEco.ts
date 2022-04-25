import Command, { Categories } from "../../../types/IlluminatiCommand";
const command: Command = {
    name: 'debugeco',
    ownerOnly: true,
    description: 'Debugging economy',
    aliases: ["de"],
    run(message, args, settings, client, meta) {
        const amount = args[0]
        
        if (!amount) {
            return message.channel.send(`Please specify an amount to add.`)
        }

        meta.user.addMoney(parseFloat(amount))
        message.channel.send(`You have successfully added ${amount} to your account.`)
    }
}
export default command