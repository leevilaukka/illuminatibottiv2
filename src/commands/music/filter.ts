import Command from '../../types/IlluminatiCommand'
const command: Command = {
    name: 'filter',
    args: true,
    execute(message, args: any, settings, client, interaction) {
        const filterName = args[0]
        const queue = client.player.getQueue(message.guild)
        const enabledFiltersKeys = queue.getFiltersEnabled()

        if (queue && !enabledFiltersKeys.includes(filterName)){
            queue.setFilters({[filterName]: true})
        } else if(enabledFiltersKeys.includes(filterName)){
            queue.setFilters({[filterName]: false})
        }
    }
}
export default command