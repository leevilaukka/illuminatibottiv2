import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'disconnect',
    category: 'music',
    description: 'Disconnect from the voice channel',
    aliases: ['dc', 'leave'],
    guildOnly: true,
    execute(message, args, settings, client, interaction) {
        const queue = client.player.getQueue(message.guild)

        if (queue) {
            queue.destroy(true)
            return message.reply("Heippa!")
        } else {
            return message.reply("Mikään ei soi")
        }
    }
}
export default command