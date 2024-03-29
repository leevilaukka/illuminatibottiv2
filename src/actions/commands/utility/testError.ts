import { CommandError, CommandNotFoundError, DatabaseError, ErrorWithStack, PlayerError } from '../../../structures/Errors';
import { Command } from "../../../types"
import { BotError, UserError } from "../../../structures/Errors";

const command: Command = {
    name: 'testerror',
    ownerOnly: true,
    description: 'Test error',
    aliases: ["te"],
    category: "utility",
    async run(message, args, settings, client) {
        const errorType = args[0]
        const errorMessage = args.slice(1).join(' ')
        let error = null;

        switch (errorType) {
            case 'user':
                error = new UserError(errorMessage)
                break
            case 'bot':
                error = new BotError(errorMessage)
                break
            case 'commandNotFound':
                error = new CommandNotFoundError(errorMessage)
                break
            case 'player':
                error = new PlayerError(errorMessage, client.player.nodes.get(message.guild)?.player)
                break
            case 'database':
                error = new DatabaseError(errorMessage)
                break
            case 'command':
                error = new CommandError(errorMessage, command)
                break
            case 'errorWithStack':
                error = new ErrorWithStack(errorMessage)
                break
            case "clientError":
                error = new Error(errorMessage)
                client.emit("error", error)
                break
            default:
                error = new Error(errorMessage)
                break
        }

        throw error
    }
}

export default command

