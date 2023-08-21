import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Pay a user")
        .addUserOption(option => option.setName("user").setDescription("User to pay").setRequired(true))
        .addIntegerOption(option => option.setName("amount").setDescription("Amount to pay").setRequired(true))
        .toJSON(),
    async execute(client, interaction) {
        const user = interaction.options.getUser('user', true);
        const amount = interaction.options.get('amount').value as number;

        if (amount < 0) {
            await interaction.reply("You can't pay a negative amount!");
            return;
        }

        if (amount > 1000000) {
            await interaction.reply("You can't pay more than 1 million!");
            return;
        }

        const toPay = new client.userManager(user);

        if (toPay.bot) {
            await interaction.reply("You can't pay a bot!");
            return;
        }

        const from = new client.userManager(interaction.user);

        const userBalance = (await from.getStats()).money

        if (userBalance < amount) {
            await interaction.reply(`You don't have enough money! You only have ${userBalance}!`);
            return;
        }

        await from.addMoney(-amount);
        await toPay.addMoney(amount);

        await interaction.reply(`You paid ${user} ${amount}!`);
    },
}

export default command;