import { QueueFilters } from 'discord-player'
import Command from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'filter',
    category: 'music',
    description: 'Aseta toistoon filtteri',
    usage: '<type>',
    guildOnly: true,
    execute(message, args, settings, client) {
        const filterName = args[0] as keyof QueueFilters
        const queue = client.player.getQueue(message.guild)

        if (!queue) return message.channel.send('Musiikkia ei ole käynnissä')
        
        const enabledFiltersKeys = queue.getFiltersEnabled()

        if (!queue.getFiltersDisabled().includes(filterName) || !enabledFiltersKeys.includes(filterName)) {
            return message.reply("Filteriä ei saatavilla")
        }

        if(!filterName) {
            return message.reply(`Käynnissä olevat filterit: \`${enabledFiltersKeys.map(filter => `${filter}, `)}\``)
        }

        if (queue && !enabledFiltersKeys.includes(filterName)){
            queue.setFilters({[filterName]: true})
        } else if(enabledFiltersKeys.includes(filterName)){
            queue.setFilters({[filterName]: false})
        }
    }
}
export default command