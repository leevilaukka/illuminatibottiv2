import { time } from "discord.js";
import { Command } from "../../../types";

const command: Command = {
    name: "birthday",
    description: "Set your birthday",
    run: async (message, args, settings, client, {user}) => {
        const [date, month, year] = args[0].split(".", 3).map(Number);
        const birthday = new Date(year, month - 1, date, 12, 0, 0, 0);

        if (isNaN(birthday.getTime())) return message.channel.send("Päivämäärä väärässä muodossa! Käytä muotoa: DD.MM.YYYY");

        user.updateUserStats({birthday});
        message.reply(`Birthday set: ${time(birthday)}`);
    }
}

export default command;
