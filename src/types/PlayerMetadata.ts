import { GuildQueue } from "discord-player";
import { Guild, Message, TextBasedChannel, UserResolvable } from "discord.js";
import { Command } from "../types";

export type PlayerQueue = GuildQueue<PlayerMetadata>

export type PlayerMetadata = {
    channel: TextBasedChannel
    author?: UserResolvable,
    message?: Message,
    command?: Command
    fromAPI?: boolean
    guild?: Guild
    queueHidden?: boolean
}
