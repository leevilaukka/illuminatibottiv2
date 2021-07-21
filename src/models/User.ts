import { model, Schema } from "mongoose";
import { IlluminatiUser } from "../types/IlluminatiUser";

const IlluminatiUserSchema = new Schema({
    discordID: { type: String, required: true, unique: true },
    stats: {
        commandsUsed: [
            {command: String, count: Number}
        ],
        messageCount: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        nextLevelXP: { type: Number, default: 0 },
        money: { type: Number, default: 0 },
    }
})

export default model<IlluminatiUser>("User", IlluminatiUserSchema);
