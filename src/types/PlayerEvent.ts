import { Player, Track } from "discord-player"
import { IlluminatiClient } from "../structures"
import { PlayerQueue } from "./PlayerMetadata"

export type PlayerEvent = (client: IlluminatiClient, queue: PlayerQueue, option: Track | Error) => void