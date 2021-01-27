const util = require("minecraft-server-util");
const { isDevelopment } = require("../helpers/nodeHelpers");

module.exports = {
    name: "minecraft",
    description: "Minecraft Server Info",
    aliases: ["mc", "mine"],
    execute(message, args, settings, client) {
        // Variables for subcommand and server host
        const [subcommand, ...rest] = args;
        const host = rest[0] || settings.mcdefaults.host;

        // Switch-case depending on given subcommand. If no subcommand given, default to guild default
        switch (subcommand || settings.mcdefaults.action) {
            // Case for "status" subcommand
            case "status":
                return util
                    .status(host)
                    .then((res) => {
                        if(isDevelopment()) console.log(res);
                        const embed = {
                            title: res.host,
                            fields: [
                                {
                                    name: "Pelaajia",
                                    value: res.onlinePlayers,
                                },
                                {
                                    name: "Maksimipelaajamäärä",
                                    value: res.maxPlayers,
                                },
                                {
                                    name: "Versio",
                                    value: res.version,
                                },
                            ],
                            footer: {
                                text: `status - ${res.host}`,
                            },
                        };
                        message.channel.send({ embed });
                    })
                    .catch((e) =>
                        message.reply(`nyt kävi virhe :( - Palvelinta ei löytynyt tai se on offline-tilassa - ${e}`)
                    );
            // Case fo "query" subcommand
            case "query":
                return util
                    .queryFull(host)
                    .then((res) => {
                        if(isDevelopment()) console.log(res);
                        const players = res.players.toString();
                        const embed = {
                            title: res.host,
                            fields: [
                                {
                                    name: "Pelaajia",
                                    value: res.onlinePlayers,
                                },
                                {
                                    name: "Maksimipelaajamäärä",
                                    value: res.maxPlayers,
                                },
                                {
                                    name: "Versio",
                                    value: res.version,
                                },
                                {
                                    name: "Tyyppi",
                                    value: res.gameType,
                                },
                            ],
                            footer: {
                                text: `FullQuery - ${res.host}`,
                            },
                        };
                        // If res.players isn't empty, push players to embed
                        if (players) {
                            embed.fields.push({
                                name: "Pelaajat online",
                                value: players,
                            });
                        }
                        message.channel.send({ embed });
                    })
                    .catch((e) =>{
                        message.reply(`nyt kävi virhe :( - Palvelinta ei oletettavasti löytynyt tai se on offline-tilassa - ${e}`)
                        isDevelopment() && console.log(e)
                    }
                    );
            // Return default case. Only happens when user gives an undefined subcommand, because switch defaults to guild default when !subcommand.
            default:
                return message.channel.send(
                    "Nyt annoit kyllä väärän argumentin :(."
                );
        }
    },
};
