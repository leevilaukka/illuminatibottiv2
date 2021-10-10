import { Queue } from "discord-player";
import { Message, TextBasedChannels, UserResolvable } from "discord.js";
import Command from "./IlluminatiCommand";

export type PlayerQueue = Queue & {metadata: PlayerMetadata}

export type PlayerMetadata = {
    channel: TextBasedChannels,
    author?: UserResolvable,
    message: Message,
    command?: Command
}
