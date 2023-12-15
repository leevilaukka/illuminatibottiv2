import { PlayerEvent } from "../../types/PlayerMetadata"

const evt: PlayerEvent = (client, queue, message) => {
    client.isDevelopment && console.log("PLAYER_DEBUG:", message)
}

export default evt