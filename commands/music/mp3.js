const ytdl = require("ytdl-core");
const fs = require("fs");
const Discord = require("discord.js");
const { argsToString } = require("../../helpers");

module.exports = {
    name: "mp3",
    description: "Lataa Youtube-videoita MP3-tiedostoina",
    async execute(message, args, settings, client) {
        let url = argsToString(args)  
        const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(url)
        if (!regex) url = await client.player.searchVideo(url);

        const {videoDetails} = await ytdl.getBasicInfo(url)
        const fileName = `./pipes/${videoDetails.title}.mp3`

        const writer = fs.createWriteStream(fileName);
        ytdl(url).pipe(writer);

        writer.on("finish", async (resolve) => {
            console.log("Ladattu!");
            const file = new Discord.MessageAttachment(fileName);

            await message.channel.send("Latauksesi!", { files: [file] });
            fs.unlink(fileName, () => {})
        });

        writer.on("error", (err) => {
            console.error(err);
        });
    },
};
