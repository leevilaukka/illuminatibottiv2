import { IlluminatiClient } from "../../structures"

export default (client: IlluminatiClient, queue: any, error: Error) => {
    return client.logger.botError(error, null, null, queue)
}
