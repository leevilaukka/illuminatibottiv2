import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'me',
    execute(message, args, settings, client) {
        client.userManager.sendInfo(message.author,message, client)
    }
}
export default command