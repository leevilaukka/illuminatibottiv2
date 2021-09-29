import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'me',
    execute(message, args, settings, client, {user}) {
        user.sendInfo(message, client)
    }
}
export default command