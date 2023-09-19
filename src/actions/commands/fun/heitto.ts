import { randomArray } from "../../../structures/IlluminatiHelpers";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const command: Command = {
    name: "heitto",
    aliases: ["throw"],
    description: "Throw :D",
    category: Categories.other,
    cooldown: 10,
    outOfOrder: true,
    async run(message, args: any, _settings, _client, { guild }) {
        const [num = 1, option, ...rest] = args;
        if (isNaN(num)) return message.reply("anna numero.");
        if (num > 5) return message.reply("viis heittoo maks :D");

        const randoms = function (x: number, imgs: string[]): Array<string> {
            let newArr: string[] = [];
            for (let i = 0; i < x; i++) {
                const randomImage = randomArray(imgs);
                newArr.push(randomImage);
            }
            return newArr;
        };

        guild.getGuild().then((res) => {
            message.channel.send({ files: randoms(num, res.throws) });
            if (!option || option !== "-s") {
                setTimeout(() => message.delete(), 5000);
            }
        });
    },
};

export default command;
