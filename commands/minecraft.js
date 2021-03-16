const util = require("minecraft-server-util");
const { isDevelopment } = require("../helpers/nodeHelpers");
const argsToString = require("../helpers/argsToString");
const { default: axios } = require("axios");

module.exports = {
    name: "minecraft",
    description: "Minecraft Server Info ja muita juttuja :D",
    aliases: ["mc", "mine"],
    cooldown: 15,
    execute(message, args, settings, client) {
        // Variables for subcommand and server host
        const [subcommand, ...rest] = args;
        const host =
            settings.mcdefaults.host ||
            client.config.defaultSettings.mcdefaults.host;

        const rconClient = new util.RCON(host, {
            password: process.env.MCRCONPASS,
        });

        rconClient.on("output", (message) => console.log(message));

        // Switch-case depending on given subcommand. If no subcommand given, default to guild default if set, if not default to config default
        switch (
            subcommand ||
            settings.mcdefaults.action ||
            client.config.defaultSettings.mcdefaults.action
        ) {
            // Case for "status" subcommand
            case "status":
                return util
                    .status(host)
                    .then((res) => {
                        if (isDevelopment()) console.log(res);
                        const embed = {
                            title: res.host,
                            fields: [
                                {
                                    name: "Pelaajia",
                                    value: `${res.onlinePlayers} / ${res.maxPlayers}`,
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
                        message.reply(
                            `nyt kävi virhe :( - Palvelinta ei löytynyt tai se on offline-tilassa - ${e}`
                        )
                    );
            // Case for "query" subcommand
            case "query":
                return util
                    .queryFull(host)
                    .then((res) => {
                        if (isDevelopment()) console.log(res);
                        const embed = {
                            title: res.host,
                            fields: [
                                {
                                    name: "Pelaajia",
                                    value: `${res.onlinePlayers} / ${res.maxPlayers}`,
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
                        if (res.players) {
                            embed.fields.push({
                                name: "Pelaajat online",
                                value: res.players,
                            });
                        }
                        message.channel.send({ embed });
                    })
                    .catch((e) => {
                        message.reply(
                            `nyt kävi virhe :( - Palvelinta ei oletettavasti löytynyt tai se on offline-tilassa - ${e}`
                        );
                        isDevelopment() && console.error(e);
                    });
            case "say":
                const mcmessage = argsToString(rest);
                return rconClient
                    .connect()
                    .then(async () => {
                        await rconClient
                            .run(
                                `tellraw @a {"text":"DC | ${message.author.username} - ${mcmessage}"}`
                            )
                            .catch((e) => console.error(e));

                        rconClient.close();
                    })
                    .catch((e) => console.error(e));

            case "run":
                return axios
                    .get(`http://illuminati.serveminecraft.net:25555/ping`)
                    .then((ping) => {
                        if (ping.data.status === "OK") {
                            axios
                                .post(
                                    `http://illuminati.serveminecraft.net:25555/run`
                                )
                                .then((res) => {
                                    message.reply(res.data.message);
                                });
                        }
                    })
                    .catch((err) => console.error(err));

            // Return default case. Only happens when user gives an undefined subcommand, because switch defaults to guild default when !subcommand.
            default:
                return message.channel.send(
                    "Nyt annoit kyllä väärän argumentin :(."
                );
        }
    },
};
