function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'heitto',
    aliases: ["throw"],
    description: 'Throw :D',
    category: "general",
    cooldown: 10,
    execute(message, args, settings, client) {
        const [num = 1, ...rest] = args
        if (isNaN(num)) return message.reply("anna numero, saatana.");
        if (num > 5) return message.reply("viis heittoo maks :D")

        Array.prototype.rand = function() {
            if(this.length == 0) return null;
            const random = randomInteger(0, this.length-1);
            return this[random];
        }

        Array.prototype.randoms = function(x) {
            let newArr = []
            for(let i=0; i<x; i++) {
                newArr.push(this.rand())
            }
            return newArr;
        }

        //purkkaa
        const imgs = [
            "https://i.imgur.com/qrzJlKR.jpg",
            "https://i.imgur.com/K5WcvWk.png",
            "https://i.imgur.com/4FEtyd9.png",
            "https://i.imgur.com/f0jDgS9.png",
            "https://i.imgur.com/f0jDgS9.png",
            "https://i.imgur.com/ls7jWCt.png",
            "https://i.imgur.com/vlMWwEk.png",
            "https://i.imgur.com/avQq1Yv.png",
            "https://i.imgur.com/3LzycVP.png",
            "https://i.imgur.com/ZsUP3qK.png",
            "https://i.imgur.com/GxzvpmA.png",
            "https://i.imgur.com/gkr54q4.png",
            "https://i.imgur.com/OeAd8mK.png",
        ];

        message.channel.send(null , {files: imgs.randoms(num)})
    }
}
