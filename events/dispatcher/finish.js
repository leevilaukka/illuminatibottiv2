module.exports = async (client) => {
    console.log('Stream has finished playing!');
    client.voiceConnection.disconnect();
};