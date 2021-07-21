import { Message } from "discord.js";

const messageCheck = (message: Message) => {
    if (message.content.includes("?")) return message.reply("mutsis");
}

export default messageCheck