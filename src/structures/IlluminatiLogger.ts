import { IlluminatiClient } from "."
import { Console } from "console"

export default class IlluminatiLogger extends Console {
    client: IlluminatiClient
    
    constructor(client: IlluminatiClient) {
        super(process.stdout, process.stderr)
        this.client = client
    }

    log(message?: any, optionalParams?: any[]) {
        this.client.isDevelopment && console.log(message, optionalParams)
    }
}