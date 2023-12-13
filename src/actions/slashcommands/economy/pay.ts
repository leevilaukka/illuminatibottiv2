import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Pay a user")
        .addUserOption(option => 
            option
                .setName("user")
                .setDescription("User to pay")
                .setRequired(true))
        .addIntegerOption(option => 
            option
                .setName("amount")
                .setDescription("Amount to pay")
                .setRequired(true))
        .toJSON(),
    async execute(client, interaction) {
        const toPay = new client.userManager(interaction.options.getUser('user', true));
        const amount = interaction.options.getInteger('amount', true);

        if (amount < 0) {
            await interaction.reply("You can't pay a negative amount!");
            return;
        }

        if (toPay.user.bot) {
            await interaction.reply("You can't pay a bot!");
            return;
        }

        if (!await toPay.userData) {
            await interaction.reply("You can't pay someone who hasn't joined Illuminati!");
            return;
        }
        
        const from = new client.userManager(interaction.user);

        const userBalance = (await from.getStats()).money

        if (userBalance < amount) {
            await interaction.reply(`You don't have enough money! You only have ${userBalance}!`);
            return;
        }

        from.tradeMoney(toPay, amount, interaction);

        await interaction.reply(`You paid ${toPay.username} ${amount}!`);
    },
}

export default command;