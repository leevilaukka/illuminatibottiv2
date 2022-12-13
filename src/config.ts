import { APIEmbed } from "discord.js"
import { IlluminatiEmbed } from "./structures"

export type Config = {
  token: string,
  devServerID: string,
  ownerID: string,
  defaultSettings: GuildSettings
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
  throws: string[],
  places: {
    name: string,
    location: {
      type: string,
      coordinates: [number, number]
    }
  }[],
  disabledCommands: string[],
  removedMemberChannel: string,
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
  },
} as const


export default config