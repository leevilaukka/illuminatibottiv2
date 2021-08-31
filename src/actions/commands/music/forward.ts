import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'forward',
    outOfOrder: true,
    async execute(message, args: string[], settings, client) {
        const queue = client.player.getQueue(message.guild)
        const time = queue.getPlayerTimestamp().current.split(":")
        const seconds = Number(time[0]) * 60 + Number(time[1])
        console.log(seconds)
        queue.seek(seconds + (parseInt(args[0]) || 1) * 1000)
    }
}
export default command