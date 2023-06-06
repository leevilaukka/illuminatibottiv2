import { APIEmbed, Channel, Embed, Message, User } from "discord.js"
import { IlluminatiEmbed } from "./structures"
import { Track } from "discord-player"

export type Config = {
  token: string,
  devServerID: string,
  ownerID: string,
  defaultSettings: GuildSettings
}

export type DeletedMessage = {
  message: String,
  author:  {
    name: string,
    discriminator: string,
    id: string
  },
  deletor: {
    name: string,
    discriminator: string,
    id: string
  },
  timestamp: number,
  messageID: string,
  channel: {
    name: string,
    id: string
  },
  embeds: Embed[],
}

export type GuildSettings = {
  prefix: string,
  volume: number,
  randomMessages: boolean,
  minecraft: {
    action: string,
    host: string
  },
  embeds: IlluminatiEmbed[]
  leaveOnEmpty: boolean,
  throws: Array<string>,
  places: {
    name: string,
    location: {
      type: string,
      coordinates: [number, number]
    }
  }[],
  disabledCommands: string[],
  removedMemberChannel: string,
  deletedMessages: DeletedMessage[],
  commandErrors: {
    [key: string]: number
  },
  stacksEnabled: boolean,
  playlists: {
    name: string,
    tracks: Track[]
  }[]
}

const config = {
  token: process.env.TOKEN,
  devServerID: process.env.DEVSERVERID,
  ownerID: process.env.OWNERID,
  defaultSettings: {
    // CHANGE THESE TO YOUR OWN IF HOSTING

    // Channel to send notifications of removed members to
    removedMemberChannel: "",
    
    // Leave voice channel when empty
    leaveOnEmpty: false, 
    
    // Prefix for commands
    prefix: "*",
    
    // Volume of the bot
    volume: 1,
    
    // Random messages
    randomMessages: false,
    
    // Minecraft server defaults
    minecraft: {
      action: "status",
      host: process.env.MCHOST,
    },
    
    // Don't edit these
    embeds: [] as IlluminatiEmbed[],
    places: [] as {
      name: string,
      location: {
        type: string,
        coordinates: [number, number]
      }
    }[],
    throws: [] as string[],
    disabledCommands: [] as string[],
    deletedMessages: [] as DeletedMessage[],
    commandErrors: {} as {
      [key: string]: number
    },
    stacksEnabled: true,
    playlists: [] as {
      name: string,
      tracks: Track[]
    }[]
  },
} as const


export default config