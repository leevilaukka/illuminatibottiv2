import { UserError } from "../../../structures/Errors";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

export default {
    name: "disconnect",
    category: Categories.music,
    description: "Disconnect from the voice channel",
    aliases: ["dc", "leave"],
    guildOnly: true,
    run({reply}, args, settings, client, {queue}) {
        if (queue) {
            queue.delete();
            return reply("Heippa!");
        } else {
            throw new UserError("Mikään ei soi!");
        }
    },
} as Command;

