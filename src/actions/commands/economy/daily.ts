import Command, { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: 'daily',
    outOfOrder: true,
    category: Categories.currency,
    run(message, args, settings, client) {
        return message.reply('Daily is not implemented yet.')
    }
}
export default command