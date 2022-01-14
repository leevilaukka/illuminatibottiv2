import Command, {Categories} from "IlluminatiCommand";

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const command: Command = {
    name: 'heitto',
    aliases: ["throw"],
    description: 'Throw :D',
    category: Categories.other,
    cooldown: 10,
    outOfOrder: true,
    async run(message, args: any, _settings, _client, { guild }) {
        const [num = 1, option, ...rest] = args
        if (isNaN(num)) return message.reply("anna numero, saatana.");
        if (num > 5) return message.reply("viis heittoo maks :D")

        const rand = function(arr) {
            if(arr.length == 0) return null;
            const random = randomInteger(0, arr.length - 1);
            return arr[random];
        }

        const randoms = function(x: number, imgs: string[]):Array<string> {
            let newArr = []
            for(let i=0; i<x; i++) {
                newArr.push(rand(imgs))
            }
            return newArr;
        }

        guild.getGuild()
            .then((res: any) => {
                message.channel.send({files: randoms(num, res.imgs)})
                if (!option || option !== "-s") {
                    setTimeout(() => message.delete(), 5000);
                }
            })
    }
}

export default command
