import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";
import MusicQuiz from "../../../structures/MusicQuiz";
import { randomArray } from "../../../structures/IlluminatiHelpers";

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("musicquiz")
        .addSubcommand(subcommand => subcommand
            .setName("start")
            .setDescription("Start a music quiz")
            .addNumberOption(option => option
                .setName("rounds")
                .setDescription("Amount of rounds")
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName("playlist")
                .setDescription("Playlist to play from")
            )
            .addNumberOption(option => option
                .setName("timeout")
                .setDescription("Timeout for each round in seconds")
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
        .setDescription("Music quiz")
        .toJSON()
    ,async execute(client, interaction) {
        const guild = new client.guildManager(interaction.guild);

        const defaultSettings = (await guild.getGuild()).musicQuiz;

        const playlists = interaction.options.getString("playlist") || randomArray(defaultSettings.playlists) || "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "start": {
                if(client.quizzes.has(interaction.guildId)) {
                    return interaction.reply({ content: "There is already a quiz running!", ephemeral: true });
                }

                new MusicQuiz(interaction, playlists, client, {
                    timeout: interaction.options.getNumber("timeout") * 1000 || 30000,
                    rounds: interaction.options.getNumber("rounds") || defaultSettings.rounds || 10, 
                    points: [interaction.options.getNumber("titlepoints") || defaultSettings.points[0] || 2 , interaction.options.getNumber("artistpoints") || defaultSettings.points[1] || 1]
                });

                interaction.reply({ content: "Starting quiz..."});
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
