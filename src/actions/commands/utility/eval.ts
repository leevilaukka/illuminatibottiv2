import { ErrorWithStack } from "../../../structures/Errors";
import { codeBlock, Formatters, Utils } from "discord.js";
import { argsToString } from "../../../helpers";
import { clean } from "../../../structures/IlluminatiHelpers";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
const command: Command = {
    name: "eval",
    description: "Evaluate JavaScript expressions",
    ownerOnly: true,
    args: true,
    category: Categories.config,
    async run(message, args, _settings, client, user) {
        try {
            const code = argsToString(args);
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            const splitMessage = clean(evaled).match(/[\s\S]{1,1900}/g) || [];

            for (const block of splitMessage) {
                await message.channel.send({ content: codeBlock("js", block) });
            }
        } catch (err) {
            throw new ErrorWithStack(err);
        }
    },
};

export default command;
