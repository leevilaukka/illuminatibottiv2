import { Queue } from "discord-player";
import { Message, TextBasedChannel, UserResolvable } from "discord.js";
import { Command } from "../types";

export type PlayerQueue = Queue & {metadata: PlayerMetadata}

export type PlayerMetadata = {
    channel: TextBasedChannel
    author?: UserResolvable,
    message?: Message,
    command?: Command
    fromAPI?: boolean
}
