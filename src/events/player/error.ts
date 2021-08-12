import { IlluminatiClient } from "../../structures"
import { PlayerQueue } from "../../types/PlayerMetadata"

export default (client: IlluminatiClient, queue: PlayerQueue, error: Error) => {
    return console.error(error)
}
