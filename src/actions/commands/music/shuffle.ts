import Command, { Categories } from '../../../types/IlluminatiCommand'


const command: Command = {
    name: 'shuffle',
    description: 'Shuffles the queue.',
    guildOnly: true,
    category: Categories.music,
    run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild)
        if (queue.tracks.length > 1) {
            queue.shuffle()
            return message.reply('Sekoitetaan jono :twisted_rightwards_arrows:')
        } else {
            return message.reply('Jono on tällä hetkellä tyhjä tai siinä on liian vähän kappaleita')
        }
    }
}
export default command