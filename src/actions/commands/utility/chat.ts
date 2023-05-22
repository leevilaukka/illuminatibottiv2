import { Message, TextChannel } from "discord.js";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
import { OpenAIApi } from "openai";
import { Configuration } from "openai/dist/configuration";
import { argsToString } from "../../../structures/IlluminatiHelpers";

const command: Command = {
    name: "chat",
    aliases: ["ch"],
    description: "Use ChatGPT-3",
    category: Categories.other,
    outOfOrder: true,
    guildOnly: true,
    usage: "<message>",
    args: true,
    run: async (message: Message, args: string[]) => {
        const config = new Configuration({
            apiKey: process.env.OPENAI_KEY,
        });

        const openai = new OpenAIApi(config);

        const response = await openai
            .createCompletion({
                model: "gpt-3.5-turbo",
                prompt: argsToString(args),
            })
            .then((res) => {
                return res.data.choices[0].text;
            });

        message.channel.send(response);
    },
};

export default command;
