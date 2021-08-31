import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'daily',
    outOfOrder: true,
    execute(message, args, settings, client) {
        return message.reply('Daily is not implemented yet.')
    }
}
export default command