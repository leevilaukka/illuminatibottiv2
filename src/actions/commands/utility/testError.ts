import { CommandError, CommandNotFoundError, DatabaseError, ErrorWithStack, PlayerError } from '../../../structures/errors';
import Command from "IlluminatiCommand";
import { BotError, UserError } from "../../../structures/errors";

const command: Command = {
    name: 'testerror',
    ownerOnly: true,
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
                error = new PlayerError(errorMessage)
                break
            case 'database':
                error = new DatabaseError(errorMessage)
                break
            case 'command':
                error = new CommandError(errorMessage)
                break
            case 'errorWithStack':
                error = new ErrorWithStack(errorMessage)
                break
            default:
                error = new Error(errorMessage)
                break
        }

        throw error
    }
}

export default command

