import { PlayerEvent } from "../../types/PlayerEvent"

const evt: PlayerEvent = (client, queue, message) => {
    client.isDevelopment && console.log("Player debug:", message)
}

export default evt