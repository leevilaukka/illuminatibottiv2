import { ChatInputApplicationCommandData, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder  } from "discord.js";
import { SlashCommand } from "../../../types";

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setNameLocalizations({
            fi: "soita",
        })
        .setDescription("Play a song")
        .setDescriptionLocalizations({
            fi: "Soita kappale",
        })
        .addStringOption(option => option
            .setName("song").setNameLocalization("fi", "kappale")
            .setDescription("Song to play").setDescriptionLocalization("fi", "Kappale jonka haluat soittaa")
            .setRequired(true).setAutocomplete(true)
        )
        .addBooleanOption(option => option
            .setName("playnext")
            .setNameLocalization("fi", "seuraava")
            .setDescription("Play next").setRequired(false)
            .setDescriptionLocalization("fi", "Soita seuraavaksi")
        )
        .toJSON()
    ,async execute(client, interaction) {
        const player = client.player;
        const query = interaction.options.getString('song', true);
        const playNext = interaction.options.getBoolean('playnext', false);

        await interaction.deferReply();
        const searchResult = await player.search(query, { requestedBy: interaction.user });

        try {
            if (!searchResult.hasTracks()) {
                //Check if we found results for this query
                await interaction.editReply(`We found no tracks for ${query}!`);
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
                        await interaction.editReply(`Playing ${res.track.title} next!`);
                        return;
                    }
                    await interaction.editReply(`Added ${res.track.title} to the queue!`);
                } else {
                    await interaction.editReply(`Playing ${res.track.title}!`);
                }
            }
        } catch (error) {
            console.log(error);
            await interaction.editReply("Something went wrong!");
        }
    },
    async autocomplete(client, interaction) {
        const player = client.player;
        const query = interaction.options.getString('song', true);
        const results = await player.search(query);

        if (!query) return
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