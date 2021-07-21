import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'debugeco',
    ownerOnly: true,
    description: 'Debugging economy',
    aliases: ["de"],
    execute(message, args: number[], settings, client, interaction) {
        const [amount] = args
        if (!amount) {
            return message.channel.send(`Please specify an amount to add.`)
        }
        message.author.addMoney(amount)
        message.channel.send(`You have successfully added ${amount} to your account.`)
    }
}
export default command