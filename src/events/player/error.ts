import { GuildQueue } from "discord-player"
import { IlluminatiClient } from "../../structures"
import { PlayerEvent, PlayerMetadata } from "PlayerMetadata"
import { GuildChannel, TextBasedChannel } from "discord.js"
const evt: PlayerEvent = async (client: IlluminatiClient, queue: GuildQueue<PlayerMetadata>, error: Error) => {
    console.error(error)

    if (client.quizzes.has(queue.metadata.channel.id)) {
        const quiz = client.quizzes.get(queue.metadata.channel.id)
        await quiz.stop()
    }

    return client.sendError(error, queue.metadata.channel, true)
}

export default evt