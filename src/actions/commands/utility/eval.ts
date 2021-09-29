import { ContextMenuInteraction, Formatters, Util } from "discord.js";
import { argsToString } from "../../../helpers";
import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: 'eval',
    description: 'Evaluate JavaScript expressions',
    ownerOnly: true,
    args: true,
    category: "config",
    async execute(message, args, _settings, client, user) {
        try {
            this.arguments = {message, args, _settings, client, user};
            const code = argsToString(args)
            let evaled = eval(code)

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            const splitMessage = Util.splitMessage(client.clean(evaled))

            for (const block of splitMessage) {
               await message.channel.send({content: Formatters.codeBlock(block)});
            }
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${client.clean(err)}\n\`\`\``);
        }
    }
}

export default command