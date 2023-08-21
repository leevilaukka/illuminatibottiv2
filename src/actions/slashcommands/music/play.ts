import { GuildMember, SlashCommandBuilder  } from "discord.js";
import { SlashCommand } from "../../../types";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption(option => option.setName("song").setDescription("Song to play").setRequired(true).setAutocomplete(true))
        .addBooleanOption(option => option.setName("playnext").setDescription("Play next").setRequired(false))
        .toJSON()
    ,async execute(client, interaction) {
        const player = client.player;
        const query = interaction.options.get('song').value as string;
        const playNext = interaction.options.get('playnext')?.value as boolean;
        const searchResult = await player.search(query, { requestedBy: interaction.user });

        if (!searchResult.hasTracks()) {
            //Check if we found results for this query
            await interaction.reply(`We found no tracks for ${query}!`);
            return;
        } else {
            const member = interaction.member as GuildMember;
            const res = await player.play(member.voice.channel, searchResult, {
                requestedBy: interaction.user,
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        author: interaction.user,
                        guild: interaction.guild,
                    }
                },
            });

            if (res.queue.tracks.data.length > 0) {
                if (playNext) {
                    res.queue.moveTrack(res.queue.tracks.data.length - 1, 0);
                    await interaction.reply(`Playing ${res.track.title} next!`);
                    return;
                }
                await interaction.reply(`Added ${res.track.title} to the queue!`);
            } else {
                await interaction.reply(`Playing ${res.track.title}!`);
            }
        }
        
    },
    async autocomplete(client, interaction) {
        const player = client.player;
        const query = interaction.options.getString('song', true);
        const results = await player.search(query);

        //Returns a list of songs with their title
        return interaction.respond(
            results.tracks.slice(0, 10).map((t) => ({
                name: `${t.title} | ${t.author}`,
                value: t.url
            }))
        );
    }
}

export default command;