import Command ,{ Categories } from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'me',
    async run(message, args, settings, client, {user}) {
        (await user.infoAsEmbed(message, client)).send()
    }
}
export default command