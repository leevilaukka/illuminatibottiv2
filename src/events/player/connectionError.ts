import { PlayerEvent } from "../../types/PlayerEvent"

const evt: PlayerEvent = (client, queue, error) => {
    return queue.metadata.channel.send(`:x: **${client.user.username || undefined}**: ${error}`)
}

export default evt