const ytdl = require("ytdl-core-discord");
const play = async (message, url) => {
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(await ytdl(url), {type:'opus', highWaterMark: 50});
        dispatcher.on('start', () => {
            console.log('Stream is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('Stream has finished playing!');
            connection.disconnect();
        });

// Always remember to handle errors appropriately!
        dispatcher.on('error', console.error);
    } else {
        await message.channel.send("Et ole puhekanavalla, en voi liittyä");
    }
};
module.exports = play;
