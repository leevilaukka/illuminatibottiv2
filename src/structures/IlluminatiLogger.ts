import { Message, User } from "discord.js"
import Error from "../models/BotError"
import Command from "../types/IlluminatiCommand"

export default class IlluminatiLogger extends console.Console {
    constructor() {
        super(process.stdout, process.stderr)
    }

    log(message?: any, optionalParams?: any[]) {
        console.log(message, optionalParams)
    }

    async botError(message?: any, discordMessage?: Message, command?: Command, optionalParams?: any[]) {
        console.error(message, optionalParams)

        const newDoc = new Error({
            message: discordMessage?.toJSON(),
            errorMessage: message,
            command: command?.name
        })

        newDoc.save()
        const reply = await discordMessage.reply({content: "nyt tapahtui jokin virhe: " + message})
        reply.react("💾")

        const filter = (reaction: any, user: User) => {
            return ["💾"].includes(reaction.emoji.name) && !user.bot;
        };

        reply.awaitReactions({filter, time: 5000}).then(collected => {
            if(collected.get("💾")?.count <= 2) {
                reply.delete()
            } else return
        })
    }
}