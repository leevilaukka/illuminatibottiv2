import { IlluminatiEmbed } from "../../../structures";
import { SlashCommand } from "../../../types";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("me")
        .setDescription("Get your stats!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("musicquiz")
                .setDescription("Get your music quiz stats!")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("commands")
                .setDescription("Get your command stats!")
        )
        .toJSON(),

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "musicquiz": {
                const user = new client.userManager(interaction.user);
                const musicQuizStats = (await user.getStats()).musicQuiz;

                if (!musicQuizStats) {
                    return new IlluminatiEmbed(interaction, client)
                        .setTitle("Music Quiz Stats")
                        .setDescription("You haven't played any music quizzes yet!")
                        .send();
                }

                const fields = [
                    {
                        name: "Correct Answers",
                        value: musicQuizStats.correctAnswers.toString(),
                        inline: true,
                    },
                    {
                        name: "Incorrect Answers",
                        value: musicQuizStats.incorrectAnswers.toString(),
                        inline: true,
                    },
                    {
                        name: "Total Answers",
                        value: musicQuizStats.totalAnswers.toString(),
                        inline: true,
                    },
                    {
                        name: "Total Points",
                        value: musicQuizStats.totalPoints.toString(),
                        inline: true,
                    },
                    {
                        name: "Total Wins",
                        value: musicQuizStats.totalWins.toString(),
                        inline: true,
                    },
                    {
                        name: "Win Rate",
                        value: `${((musicQuizStats.totalWins / musicQuizStats.totalAnswers) * 100).toFixed(2)}%`,
                        inline: true,
                    },
                    {
                        name: "Average Points Per Answer",
                        value: (musicQuizStats.totalPoints / musicQuizStats.totalAnswers).toFixed(2),
                        inline: true,
                    },
                    {
                        name: "Average Points Per Game",
                        value: (musicQuizStats.totalPoints / musicQuizStats.totalGames).toFixed(2),
                        inline: true,
                    },
                    {
                        name: "Average Points Per Win",
                        value: (musicQuizStats.totalPoints / musicQuizStats.totalWins).toFixed(2),
                        inline: true,
                    },
                ];

                new IlluminatiEmbed(interaction, client)
                    .setTitle("Music Quiz Stats")
                    .setDescription("Here are your music quiz stats!")
                    .addFields(fields)
                    .send();
            }
            case "commands": {
                const user = new client.userManager(interaction.user);
                const commandStats = (await user.getStats()).commandsUsed;

                console.log(commandStats);

                if (!commandStats) {
                    return new IlluminatiEmbed(interaction, client)
                        .setTitle("Command Stats")
                        .setDescription("You haven't used any commands yet!")
                        .send();
                }

                const fields = [[]];
                let i = 0;

                for (const [command, count] of commandStats) {
                    if (fields[i].length === 25) {
                        fields.push([]);
                        i++;
                    }

                    fields[i].push({
                        name: command,
                        value: count.toString(),
                        inline: true,
                    });
                }

                const embed = new IlluminatiEmbed(interaction, client)
                    .setTitle("Command Stats")
                    .setDescription("Here are your command stats!")
                    .addFields(fields[0]);


                if (fields.length > 1) {
                    for (let i = 1; i < fields.length; i++) {
                        embed.addPage(
                            new IlluminatiEmbed(interaction, client)
                                .setTitle("Command Stats")
                                .setDescription("Here are your command stats!")
                                .addFields(fields[i])
                        );
                    }
                }

                interaction.reply({
                    embeds: [embed],
                });                
            }
        }
    }
}

export default command;