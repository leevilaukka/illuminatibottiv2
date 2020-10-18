module.exports = async (client, loop) => {
    console.log('Stream has finished playing!');
    if (loop.loop) {
        client.play(loop.message, loop.url, loop.loop)
    } else {
        client.voiceConnection.disconnect();
    }
};
