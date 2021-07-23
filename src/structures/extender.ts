import { Structures } from "discord.js"
import IlluminatiGuild from "./IlluminatiGuild"
import { IlluminatiUser } from "./IlluminatiUser"

const extendAll = async () => {
    Structures.extend("User", () => IlluminatiUser) // Extend the User structure
    Structures.extend("Guild", () => IlluminatiGuild) // Extend the Guild structure
    console.log("Structures extended!") // Log that it was done
}

export default extendAll