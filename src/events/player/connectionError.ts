import { PlayerEvent } from "../../types/PlayerEvent"

const evt: PlayerEvent = (client, queue, error: Error) => {
    console.error(error)
    return client.sendError(error, queue.metadata.channel, true)
}

export default evt