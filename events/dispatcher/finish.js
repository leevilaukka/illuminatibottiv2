const { isDevelopment } = require("../../helpers/nodeHelpers");

module.exports = async (client, loop) => {
    if(isDevelopment) console.log('Stream has finished playing!');
    if (loop.loop) {
        client.play(loop.message, loop.url, loop.loop)
    } else {
        client.voiceConnection.disconnect();
    }
};
