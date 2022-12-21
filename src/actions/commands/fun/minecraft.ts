import util from "minecraft-server-util";

import { argsToString } from "../../../helpers";
import { IlluminatiEmbed, Errors } from "../../../structures";

import Command, { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "minecraft",
    description: "Minecraft Server Info ja muita juttuja :D",
    aliases: ["mc", "mine"],
    cooldown: 15,
    category: Categories.other,
    async run(message, args, settings, client) {
        // Variables for subcommand and server host
        const [subcommand, ...rest] = args;
        const host =
            settings.minecraft.host ||
            client.config.defaultSettings.minecraft.host;

        const rconClient = new util.RCON(host, {
            password: process.env.MCRCONPASS,
        });

        rconClient.on("output", (message) => console.log(message));

        // Switch-case depending on given subcommand. If no subcommand given, default to guild default if set, if not default to config default
        switch (
            subcommand ||
            settings.minecraft.action ||
            client.config.defaultSettings.minecraft.action
        ) {
            // Case for "status" subcommand
            case "status":
                try {
                    const res = await util.status(host);
                    if (client.isDevelopment) console.log(res);
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
                    message.channel.send({ embeds: [embed] });
                } catch (e) {
                    throw new Errors.BotError(e);
                }
            // Case for "query" subcommand
            case "query":
                try {
                    const res_1 = await util.queryFull(host);
                    if (client.isDevelopment) console.log(res_1);
                    const embed_1 = new IlluminatiEmbed(message, client, {
                        title: res_1.host,
                        fields: [
                            {
                                name: "Pelaajia",
                                value: `${res_1.onlinePlayers} / ${res_1.maxPlayers}`,
                            },
                            {
                                name: "Versio",
                                value: res_1.version,
                            },
                            {
                                name: "Tyyppi",
                                value: res_1.gameType,
                            },
                        ],
                    });

                    // If res.players isn't empty, push players to embed
                    if (res_1.players) {
                        embed_1.addFields([
                            {
                                name: "Pelaajat online",
                                value: res_1.players.join(),
                                inline: false,
                            },
                        ]);
                    }
                    embed_1.send();
                } catch (e_1) {
                    throw new Errors.BotError(
                        `nyt kävi virhe :( - Palvelinta ei oletettavasti löytynyt tai se on offline-tilassa - ${e_1}`
                    );
                }
            case "say":
                const mcmessage = argsToString(rest);
                try {
                    await rconClient.connect();
                    await rconClient
                        .run(
                            `tellraw @a {"text":"DC | ${message.author.username} - ${mcmessage}"}`
                        )
                        .catch((e_2) => console.error(e_2));

                    rconClient.close();
                } catch (e_3) {
                    throw new Errors.BotError(e_3);
                }

            case "run":
                try {
                    const ping = await client.axios.get(
                        `http://illuminati.serveminecraft.net:25555/ping`
                    );
                    if (ping.data.status === "OK") {
                        client.axios
                            .post(
                                `http://illuminati.serveminecraft.net:25555/run`,
                                { author: message.author.username }
                            )
                            .then((res_2) => {
                                message.reply(res_2.data.message);
                            });
                    } else {
                        return message.reply(
                            `servukone ei oo päällä, valita Laukalle!`
                        );
                    }
                } catch (err) {
                    throw new Errors.BotError(err);
                }

            // Return default case. Only happens when user gives an undefined subcommand, because switch defaults to guild default when !subcommand.
            default:
                return message.channel.send(
                    "Nyt annoit kyllä väärän argumentin :(."
                );
        }
    },
};

export default command;
