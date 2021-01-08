const { isDevelopment } = require("../../helpers/nodeHelpers");

module.exports = async (client) => {
    if(isDevelopment) console.log('Stream is now playing!');
};