import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder  } from "discord.js";
import { SlashCommand } from "../../../types";
import { IlluminatiEmbed } from "../../../structures";

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
                const embed = new IlluminatiEmbed(interaction, client)
                    .setThumbnail(res.track.thumbnail)
                    .addFields([
                        {
                            name: "Duration",
                            value: res.track.duration,
                            inline: true
                        },
                        {
                            name: "Author",
                            value: res.track.author,
                            inline: true
                        },
                    ])
                    .setFooter({
                        text: `Requested by ${res.track.requestedBy.tag}`,
                        iconURL: res.track.requestedBy.displayAvatarURL()
                    })
                    .setTimestamp();

                if (res.queue.tracks.data.length > 0) {
                    if (playNext) {
                        res.queue.moveTrack(res.queue.tracks.data.length - 1, 0);
                        embed.setTitle(`Playing next: ${res.track.title}`);
                        await interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    
                    embed.setTitle(`Added to queue: ${res.track.title}`);
                    await interaction.editReply({ embeds: [embed] });
                } else {
                    embed.setTitle(`Playing: ${res.track.title}`);
                    embed.setFooter({
                        text: `Requested by ${res.track.requestedBy.tag}`,
                        iconURL: res.track.requestedBy.displayAvatarURL()
                    });
                    await interaction.editReply({ embeds: [embed] });
                }
            }
        } catch (error) {
            console.log(error);
            await interaction.editReply("Something went wrong!");
        }
    },
    async autocomplete({ player }, interaction) {
        const query = interaction.options.getString('song', true);
        
        try {
            if (!query) return 
    
            const results = await player.search(query);

            //Returns a list of songs with their title
            return interaction.respond(
                results.tracks.slice(0, 10).map(track => ({
                    value: slice(`${track.title} - ${track.author}`, 70),
                    name: track.title,
                }))
            );                    
        } catch (error) {
            console.error(error);
        }
    }
}

const slice = (str: string, length: number) => {
    if (str.length > length) {
        return str.slice(0, length) + "...";
    } else {
        return str;
    }
}

export default command;