import { Command } from "../../../types";
import { lyricsExtractor } from "@discord-player/extractor";

const command: Command = {
    name: "lyrics",
    description: "Get lyrics for a song",
    usage: "<song name>",
    category: "music",
    cooldown: 2,

    async run(message, args, settings, client, meta) {
        const lyricsFinder = lyricsExtractor();

        const query =
            meta.queue.currentTrack?.title
            || args.join(" ");

        if (!query)
            return message.reply(
                "No song is currently playing or you didn't provide a song name"
            );

        console.log(query);

        const lyrics = await lyricsFinder.search(query)
            .catch((e) => {
                console.error(e);
            });

        if (!lyrics) return message.reply("No lyrics found for this song");

        message.reply(`
        **${lyrics.title}** by **${lyrics.artist.name}**

        ${lyrics.lyrics}
        `);
    },
};

export default command;
