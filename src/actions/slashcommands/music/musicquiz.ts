import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";
import MusicQuiz from "../../../structures/MusicQuiz";
import { randomArray } from "../../../structures/IlluminatiHelpers";
import { IlluminatiEmbed } from "../../../structures";

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("musicquiz")
        .addSubcommand(subcommand => subcommand
            .setName("start")
            .setDescription("Start a music quiz")
            .addNumberOption(option => option
                .setName("rounds")
                .setDescription("Amount of rounds")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName("playlist")
                .setDescription("Playlist to play from")
            )
            .addNumberOption(option => option
                .setName("timeout")
                .setDescription("Timeout for each round in seconds")
                .setMinValue(10)
                .setMaxValue(60)
                .setRequired(false)
            )
            .addBooleanOption(option => option
                .setName("firstartistonly")
                .setDescription("Give points for first artist only")
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("stop")
            .setDescription("Stop a music quiz")
        )
        .addSubcommand(subcommand => subcommand
            .setName("skip")
            .setDescription("Skip a song")
        )
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName("settings")
            .setDescription("Set default settings")
            .addSubcommand(subcommand => subcommand
                .setName("rounds")
                .setDescription("Set default rounds")
                .addNumberOption(option => option
                    .setName("rounds")
                    .setDescription("Amount of rounds")
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("points")
                .setDescription("Set default points")
                .addNumberOption(option => option
                    .setName("titlepoints")
                    .setDescription("Points for correct title")
                    .setRequired(true)
                )
                .addNumberOption(option => option
                    .setName("artistpoints")
                    .setDescription("Points for correct artist")
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName("thresholds")
                .setDescription("Set default answer thresholds")
                .addNumberOption(option => option
                    .setName("titlethreshold")
                    .setDescription("Threshold for title")
                    .setMaxValue(1)
                    .setMinValue(0.1)
                    .setRequired(true)
                )
                .addNumberOption(option => option
                    .setName("artistthreshold")
                    .setDescription("Threshold for artist")
                    .setMaxValue(1)
                    .setMinValue(0.1)
                    .setRequired(true)
                )
            )
        )
        .setDescription("Music Quiz 🎸🎶")
        .toJSON()
    ,async execute(client, interaction) {
        const guild = new client.guildManager(interaction.guild);

        const defaultSettings= (await guild.getGuild()).musicQuiz;

        const playlists = interaction.options.getString("playlist") || randomArray(defaultSettings.playlists) || "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";

        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

        if(subcommandGroup === "settings") {
            switch (subcommand) {
                case "rounds": {
                    const rounds = interaction.options.getNumber("rounds", true);

                    defaultSettings.rounds = rounds;
                    await guild.batchUpdateGuild({ musicQuiz: defaultSettings });

                    interaction.reply({ content: `Set default rounds to ${rounds}`});
                    break;
                }
                case "points": {
                    const titlePoints = interaction.options.getNumber("titlepoints", true);
                    const artistPoints = interaction.options.getNumber("artistpoints", true);

                    defaultSettings.points = [titlePoints, artistPoints];
                    await guild.batchUpdateGuild({ musicQuiz: defaultSettings });

                    interaction.reply({ content: `Set default points to ${titlePoints} for title and ${artistPoints} for artist`});
                    break;
                }
                case "thresholds": {
                    const titleThreshold = interaction.options.getNumber("titlethreshold", true);
                    const artistThreshold = interaction.options.getNumber("artistthreshold", true);

                    defaultSettings.answerThresholds = [titleThreshold, artistThreshold];
                    await guild.batchUpdateGuild({ musicQuiz: defaultSettings });

                    interaction.reply({ content: `Set default answer thresholds to ${titleThreshold} for title and ${artistThreshold} for artist`});
                    break;
                }
                default:
                    break;
            }
        } else switch (subcommand) {
            case "start": {
                if(client.quizzes.has(interaction.guildId)) {
                    return interaction.reply({ content: "There is already a quiz running!", ephemeral: true });
                }

                const quiz = new MusicQuiz(interaction, playlists, client, {
                    timeout: interaction.options.getNumber("timeout") * 1000 || 30000,
                    rounds: interaction.options.getNumber("rounds") || defaultSettings.rounds || 10, 
                    points: [interaction.options.getNumber("titlepoints") || defaultSettings.points[0] || 2 , interaction.options.getNumber("artistpoints") || defaultSettings.points[1] || 1],
                    firstArtistOnly: interaction.options.getBoolean("firstartistonly") || defaultSettings.firstArtistOnly || false,
                });

                const embed = new IlluminatiEmbed(interaction, client)
                    .setTitle("Music Quiz")
                    .setDescription("Starting quiz...")
                    .addFields([
                        {
                            name: "Rounds",
                            value: quiz.currentOptions.rounds.toString(),
                            inline: true
                        },
                        {
                            name: "Timeout",
                            value: (quiz.currentOptions.timeout / 1000).toString(),
                            inline: true
                        },
                        {
                            name: "Points",
                            value: `${quiz.currentOptions.points[0]} for correct title, ${quiz.currentOptions.points[1]} for correct artist`,
                            inline: true
                        }
                    ])

                interaction.reply({ embeds: [embed] });
                break;
            }
            case "stop": {
                const quiz = client.quizzes.get(interaction.guildId);

                if(!quiz) {
                    return interaction.reply({ content: "There is no quiz running", ephemeral: true });
                }

                quiz.stop();
                interaction.reply({ content: "Stopping quiz!"});
                break;
            }
            default:
                break;
        }
    }
}

export default command;
