import { PlayerEvent } from "../../types/PlayerEvent"

const evt: PlayerEvent = (client, queue, error) => {
    return console.error(error)
}

export default evt