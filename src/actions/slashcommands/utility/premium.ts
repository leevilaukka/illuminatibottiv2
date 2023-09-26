import { ApplicationCommandType, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";
import { SlashCommand } from "../../../types";

const command: SlashCommand<UserContextMenuCommandInteraction> = {
    data: new ContextMenuCommandBuilder()
        .setName("Give Premium")
        .setType(ApplicationCommandType.User)
        .toJSON(),
    async execute(client, interaction) {
        const target = interaction.targetUser;

        if (!target) {
            await interaction.reply("No user found!");
            return;
        }

        if (target.bot) {
            await interaction.reply("User is a bot!");
            return;
        }

        const user = new client.userManager(target);       
        const isPremium = (await user.getStats()).premium;

        if (isPremium) {
            await interaction.reply(`${interaction.targetUser} is premium!`);
        }

        if (!isPremium) {
            await user.updateUserStats({ premium: true });
            await interaction.reply(`Gave ${interaction.targetUser} premium!`);
        }
    }
}

export default command;