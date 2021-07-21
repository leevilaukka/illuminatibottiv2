import { Structures } from "discord.js"
import IlluminatiGuild from "./IlluminatiGuild"
import { IlluminatiUser } from "./IlluminatiUser"

const extendAll = async () => {
    Structures.extend("User", () => IlluminatiUser) // Extend the User class
    Structures.extend("Guild", () => IlluminatiGuild) // Extend the Guild class
}

export default extendAll 