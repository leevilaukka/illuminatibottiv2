import { IlluminatiClient, IlluminatiEmbed } from '../../../structures'
import Command, { Categories } from '../../../types/IlluminatiCommand'
const command: Command = {
    name: 'toggle',
    permissions: ['MANAGE_GUILD'],
    async run(message, args, settings, client, { guild }) {
        const commandName = args[0] as string
        
        const disabledCommands = (await guild.getGuild()).disabledCommands

        if (!commandName) {
            return new IlluminatiEmbed(message, client, {
                title: 'Estetyt komennot',
                description: disabledCommands.toString() || 'Ei estettyjä komentoja',
            }).send()
        }

        

        const command = IlluminatiClient.getCommand(commandName)

        if (!command) {
            message.reply(`komentoa \`${commandName}\` ei löydy`)
            return
        }

        if (await guild.isCommandDisabled(command.name)) {
            disabledCommands.splice(disabledCommands.indexOf(command.name), 1)
            guild.updateGuild({ disabledCommands })
            message.reply(`komento \`${command.name}\` on nyt käytössä`)
        } else {
            disabledCommands.push(command.name)
            guild.updateGuild({ disabledCommands })
            message.reply(`komento \`${command.name}\` on nyt estetty`)
        }
            
    }
}

export default command