import Discord from "discord.js";
import fs from "fs";

import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
import AttachmentWriterWrapper from "../../../structures/PipedImage";
const command: Command = {
    name: "tinder",
    description: "Tinder-äänestys",
    args: true,
    usage: "<määrä> <token> <aika>",
    cooldown: 10,
    category: Categories.fun,
    async run(message, args: any, settings, client) {
        message.delete();

        let [maxCount, token, timeout]: [number, string, number] = args;
        let easyMode: Discord.Message;

        maxCount = maxCount - 1;
        maxCount < 1 ? (maxCount = 1) : (maxCount = maxCount);

        const config = {
            headers: {
                "X-Auth-Token": token,
            },
        };

        client.axios
            .get(`https://api.gotinder.com/v2/fast-match/preview`, {
                headers: {
                    "X-Auth-Token": token,
                },
                responseType: "stream",
            })
            .then((res) => {
                // Fs writestream path and writer
                const { writer, attachment, onFinish } = new AttachmentWriterWrapper("./pipes/tinder.png", "fast-match.png");
                
                // Pipe photo to writer
                res.data.pipe(writer);
                onFinish(async () => {
                    // Additional variables for new embed
                    !easyMode
                        ? (easyMode = await message.channel.send({
                              content: "Tästä helppo match, jos tulee vastaan.",
                              files: [attachment],
                          }))
                        : (easyMode = null);
                });
            });

        const {
            data: {
                data: { results },
            },
        } = await client.axios.get(
            "https://api.gotinder.com/v2/recs/core?locale=en",
            config
        );

        const createNewVote = (count = 0) => {
            const current = results[count];

            console.log(current);

            const currentAge =
                new Date().getFullYear() -
                new Date(current.user.birth_date).getFullYear();

            const interests =
                current.experiment_info?.user_interests.selected_interests.map(
                    (interest) => {
                        if (interest.is_common) {
                            return `**${interest.name}**`;
                        } else return interest.name;
                    }
                );

            let fields = [
                {
                    name: "Etäisyys (km)",
                    value: Math.floor(current.distance_mi * 1.609).toString(),
                    inline: true,
                },
                {
                    name: "Ikä",
                    value: currentAge.toString(),
                    inline: true,
                },
            ];

            if (
                interests &&
                    interests.length > 0
            ) {
                fields.push({
                    name: "Kiinnostukset",
                    value: interests.join(", "),
                    inline: false,
                });
            }

            if (current.user.schools.length > 0) {
                fields.push({
                    name: "Koulu",
                    value: current.user.schools[0]?.name,
                    inline: false,
                });
            }

            if (current.user.jobs.length > 0) {
                fields.push({
                    name: "Työpaikka",
                    value: current.user.jobs[0]?.name,
                    inline: false,
                });
            }

            const embed = new IlluminatiEmbed(message, client, {
                title: `${
                    current.user.recently_active ? ":green_circle: " : ""
                }${current.user.name}`,
                description: current.user.bio,
                image: {
                    url: current.user.photos[0].url,
                },
                fields,
            });

            message.channel.send({ embeds: [embed] }).then(async (tMessage) => {
                await tMessage.react("👍");
                await tMessage.react("👎");

                const filter = (reaction: any, user: Discord.User) => {
                    return (
                        ["👍", "👎"].includes(reaction.emoji.name) && !user.bot
                    );
                };

                tMessage
                    .awaitReactions({
                        filter,
                        time: timeout ? timeout * 1000 : 10000,
                    })
                    .then(async (collected) => {
                        // Lähetä request
                        const likeCount = collected.get("👍")
                            ? collected.get("👍").count - 1
                            : 0;
                        const nopeCount = collected.get("👎")
                            ? collected.get("👎").count - 1
                            : 0;

                        if (likeCount > nopeCount) {
                            // LIKE
                            client.axios
                                .get(
                                    `https://api.gotinder.com/like/${current.user._id}`,
                                    config
                                )
                                .then(({ data }) => {
                                    data.match &&
                                        message.channel.send(
                                            `${current.user.name} osui :D!`
                                        );
                                });
                        } else if (nopeCount > likeCount) {
                            // PASS
                            client.axios.get(
                                `https://api.gotinder.com/pass/${current.user._id}`,
                                config
                            );
                        }

                        if (maxCount > count) {
                            tMessage.delete();
                            createNewVote(count + 1);
                        } else {
                            const m = await message.channel.send(
                                "Se oli siinä!"
                            );
                            tMessage.delete();
                            easyMode.delete();
                            setTimeout(() => m.delete(), 5000);
                        }
                    })
                    .catch((collected) => {
                        console.error(collected);
                    });
            });
        };
        createNewVote();
    },
};

export default command;
