
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'heitto',
    aliases: ["throw"],
    description: 'Throw :D',
    category: "general",
    cooldown: 10,
    async execute(message, args, settings, client) {
        const [num = 1, option, ...rest] = args
        if (isNaN(num)) return message.reply("anna numero, saatana.");
        if (num > 5) return message.reply("viis heittoo maks :D")

        Array.prototype.rand = function() {
            if(this.length == 0) return null;
            const random = randomInteger(0, this.length - 1);
            return this[random];
        }

        Array.prototype.randoms = function(x) {
            let newArr = []
            for(let i=0; i<x; i++) {
                newArr.push(this.rand())
            }
            return newArr;
        }

        client.getGuild(message.guild)
            .then(res => {
                const imgs = res.throws
                message.channel.send(null , {files: imgs.randoms(num)})
                if (!option || option !== "-s") {
                    message.delete({timeout: 1000})
                        .catch(e => console.error(e))
                }
            })
    }
}
