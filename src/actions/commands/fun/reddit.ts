import { z } from "zod";
import { IlluminatiEmbed, Errors } from "../../../structures";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ColorResolvable,
    Message,
    TextChannel,
    time,
} from "discord.js";

const schema = z.object({
    args: z.tuple([z.string()]).rest(z.string()),
});

type Args = z.infer<typeof schema>;

const command: Command = {
    name: "reddit",
    aliases: ["r", "r/"],
    description: "Lähettää annetusta subredditistä satunnaisen postauksen",
    category: Categories.other,
    guildOnly: true,
    usage: "<subreddit>",
    evalSchema: schema,
    async run(
        message: Message & { channel: TextChannel },
        args: Args["args"],
        settings,
        client
    ) {
        const sender = message;

        // Command arguments
        const [subreddit, skipnsfw] = args;
        
        // Dynamically get random reddit post from given subreddit
        client.axios
            .get(`https://www.reddit.com/r/${subreddit}/random.json`)
            .then((res) => {
                // Subreddit found check
                if (!res.data[0])
                    return sender.reply("Subreddittiä ei löytynyt!");

                const {
                    title,
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
                const fields = [
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
                        value: time(Math.trunc(created), "F"),
                    },
                ];

                if (flair) {
                    fields.push({
                        name: "Flair",
                        value: flair,
                        inline: false,
                    });
                }

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
                } else throw new Errors.BotError("Tapahtui odottamaton virhe!");
            });
    },
};

export default command;
