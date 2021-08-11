import { model, Schema } from "mongoose";
import { IlluminatiUserTypes } from "../structures/IlluminatiUser";

const IlluminatiUserSchema = new Schema({
    discordID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    stats: {
        commandsUsed: [
            {command: String, count: Number}
        ],
        messageCount: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        nextLevelXP: { type: Number, default: 0 },
        money: { type: Number, default: 0 },
        premium: { type: Boolean, default: false },
    }
})

export default model<IlluminatiUserTypes>("User", IlluminatiUserSchema);
