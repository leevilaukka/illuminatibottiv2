import { ContextMenuInteraction, Formatters, Util } from "discord.js";
import { argsToString } from "../../../helpers";
import { clean } from "../../../structures/IlluminatiHelpers";
import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'eval',
    description: 'Evaluate JavaScript expressions',
    ownerOnly: true,
    args: true,
    category: Categories.config,
    async run(message, args, _settings, client, user) {
        try {
            this.arguments = {message, args, _settings, client, user};
            const code = argsToString(args)
            let evaled = eval(code)

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            const splitMessage = Util.splitMessage(clean(evaled))

            for (const block of splitMessage) {
               await message.channel.send({content: Formatters.codeBlock(block)});
            }
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
}

export default command