import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'me',
    execute(message, args, settings, client, interaction) {
        message.author.sendInfo(message, client)
    }
}
export default command