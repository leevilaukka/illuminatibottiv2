import { IlluminatiEmbed, Errors } from "../../../structures";
import Command, { Categories } from "../../../types/IlluminatiCommand";
import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ColorResolvable,
    Formatters,
    Message,
    TextChannel,
} from "discord.js";
import { CommandError } from "../../../structures/Errors";

const command: Command = {
    name: "reddit",
    aliases: ["r", "r/"],
    description: "Lähettää annetusta subredditistä satunnaisen postauksen",
    category: Categories.other,
    guildOnly: true,
    usage: "<subreddit>",
    args: true,
    async run(
        message: Message & { channel: TextChannel },
        args,
        settings,
        client
    ) {
        const sender = message;

        // Command arguments
        let subreddit = args[0];
        let skipnsfw = args[1];

        // Subreddit argument given check
        if (!subreddit) {
            try {
                return message.channel.send("Anna subreddit!");
            } catch (e) {
                return await message.channel.send(e);
            }
        }

        throw new CommandError("Testi", this)

        // Dynamically get random reddit post from given subreddit
        client.axios
            .get(`https://www.reddit.com/r/${subreddit}/random.json`)
            .then((res) => {
                // Subreddit found check
                if (!res.data[0])
                    return sender.reply("Subreddittiä ei löytynyt!");

                const {
                    title,
                    thumbnail: thumb,
                    url: kuva,
                    permalink,
                    author: name,
                    over_18: nsfw,
                    author_flair_text: flair,
                    author_flair_background_color: flaircolor,
                    subreddit,
                    created,
                } = res.data[0].data.children[0].data;
                const rURL = "https://www.reddit.com";
                const url = rURL + permalink;
                const subURL = rURL + `/r/${subreddit}`;
                const postaajaurl = "https://www.reddit.com/u/" + name;

                //Skip NSFW check
                if (skipnsfw !== "-s") {
                    // NSFW check
                    if (!message.channel.nsfw && nsfw) {
                        return sender.reply(
                            "En voi lähettää tätä sisältöä kuin NSFW-kanaville!"
                        );
                    }
                }

                // Embed data init
                let fields = [
                    {
                        name: "Lähettäjä",
                        value: `${name}`,
                        inline: true,
                    },
                    {
                        name: "Subreddit",
                        value: `${subreddit}`,
                        inline: true,
                    },
                    {
                        name: "Luotu",
                        value: Formatters.time(Math.trunc(created), "F"),
                    },
                ];

                if (flair) {
                    fields.push({
                        name: "Flair",
                        value: flair,
                        inline: false,
                    });
                }
                console.log(flaircolor)

                

                const color: ColorResolvable = flaircolor
                    ? flaircolor === "transparent"
                        ? 0xff4500
                        : flaircolor
                    : 0xff4500;

                    
                new IlluminatiEmbed(message, client, {
                    title,
                    url,
                    description: nsfw ? "**NSFW**" : null,
                    image: {
                        url: kuva,
                    },
                    author: {
                        name,
                        url: postaajaurl,
                    },
                    fields,
                })
                    .setColor(color)
                    .setRows(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL(url)
                                .setLabel("Postaus"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL(postaajaurl)
                                .setLabel("Postaaja"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL(subURL)
                                .setLabel("Subreddit")
                        ),
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL(rURL)
                                .setLabel("Upvote")
                        )
                    )
                    .reply();

            })
            // Catch error with Axios GET
            .catch((e) => {
                // Send error response to channel
                if (e.response) {
                    throw new Errors.BotError(
                        `Tapahtui virhe: ${e.response.status} - ${e.response.statusText}`
                    );
                }
            });
    },
};

export default command;
