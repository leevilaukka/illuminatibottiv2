import { PlayerEvent } from "../../types/PlayerEvent"

const evt: PlayerEvent = (client, queue, message) => {
    client.isDevelopment && console.log("PLAYER_DEBUG:", message)
}

export default evt