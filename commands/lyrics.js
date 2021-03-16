const { getSong } = require("genius-lyrics-api");

module.exports = {
    name: "lyrics",
    description: "Search Genius for lyrics",
    execute(message, args, settings, client) {
        const [artist, title, ...rest] = args;

        !title && artist === title;
        const options = {
            apiKey: "",
        };
        const embed = {};
        return message.reply("komento ei ole vielä valmis!");
    },
};
