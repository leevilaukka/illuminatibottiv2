import { PlayerEvent } from "../../types/PlayerMetadata"

const evt: PlayerEvent = (client, queue, error: Error) => {
    throw error
}

export default evt