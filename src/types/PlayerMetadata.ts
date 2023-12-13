import { GuildQueue, StreamDispatcher, Track } from "discord-player";
import { Guild, Message, TextBasedChannel, User, UserResolvable } from "discord.js";
import { Command } from "../types";
import { IlluminatiClient } from "../structures";

export type PlayerQueue = GuildQueue<PlayerMetadata>

export type PlayerEvent = (client: IlluminatiClient, queue: PlayerQueue, option: Track | Error | StreamDispatcher) => void

export type PlayerMetadata = {
    channel: TextBasedChannel
    author?: User ,
    message?: Message,
    command?: Command
    fromAPI?: boolean
    guild?: Guild
    queueHidden?: boolean
}
