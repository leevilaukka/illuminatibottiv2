import { Command, EventType } from "../../types";

const evt: EventType = (client, command: Command) =>
    client.isDevelopment &&
    console.log(`[CommandCall] ${command.name} called!`);

export default evt;