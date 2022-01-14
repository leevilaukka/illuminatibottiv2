import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'loop',
    description: 'Vaihda toistimen toistotilaa',
    aliases: ['l'],
    category: Categories.music,
    guildOnly: true,
    run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild)
        const loopMode = queue.repeatMode

        const queueModeResolver = [
            "Pois",
            "Kappale",
            "Jono",
            "AutoPlay"
        ]

        if (queue && loopMode < 3) {
            queue.setRepeatMode(loopMode + 1)
        } else if (!queue) {
           return message.reply("Ei jonoa mitä toistaa")
        } else {
            queue.setRepeatMode(0)
        }

        return message.reply(`Toistotila asetettu tilaan \`${queueModeResolver[queue.repeatMode]}\``)
    }
}
export default command