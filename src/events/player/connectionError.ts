import { PlayerEvent } from "../../types/PlayerEvent"

const evt: PlayerEvent = (client, queue, error: Error) => {
    throw error
}

export default evt