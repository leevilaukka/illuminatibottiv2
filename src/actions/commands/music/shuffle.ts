import { UserError } from "../../../structures/Errors";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "shuffle",
    description: "Shuffles the queue.",
    guildOnly: true,
    category: Categories.music,
    run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild);
        if (queue.tracks.length > 1) {
            queue.shuffle();
            return message.reply(
                "Sekoitetaan jono :twisted_rightwards_arrows:"
            );
        } else {
            throw new UserError(
                "Jono on tällä hetkellä tyhjä tai siinä on liian vähän kappaleita"
            );
        }
    },
};
export default command;
