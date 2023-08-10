import { Command, EventType } from "../../types";

const evt: EventType = (client, command: Command) =>
    client.isDevelopment &&
    console.log(`[CommandExec] ${command.name} executed!`);

export default evt;
