import { Model, model, Schema } from "mongoose";
import { IlluminatiUserTypes } from "../structures/IlluminatiUser";
import { User } from "discord.js";
import { IlluminatiClient } from "../structures";

interface IUserMethods {
    getDiscordUser: (client: any) => Promise<User>;
    isBirthday: () => boolean;
}

type IlluminatiUserModel = Model<IlluminatiUserTypes, {}, IUserMethods>

const IlluminatiUserSchema = new Schema<IlluminatiUserTypes, IlluminatiUserModel, IUserMethods>({
    discordID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    stats: {
        commandsUsed: {
            type: Map,
            of: Number,
            default: {},
        },
        messageCount: { type: Number, default: 0 },
        lastMessageAt: { type : Date, default: Date.now()},
        level: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        nextLevelXP: { type: Number, default: 0 },
        money: { type: Number, default: 0 },
        premium: { type: Boolean, default: false },
        dailyStreak: { type: Number, default: 0 },
        birthday: { type: Date, default: null },
    },
})

IlluminatiUserSchema.method<IlluminatiUserTypes>("getDiscordUser", async function (client: IlluminatiClient) {
    return await client.users.fetch(this.discordID);
});

IlluminatiUserSchema.method<IlluminatiUserTypes>("isBirthday", function () {
    return this.stats.birthday.getDate() === new Date().getDate() && this.stats.birthday.getMonth() === new Date().getMonth();
});

export default model<IlluminatiUserTypes, IlluminatiUserModel>("User", IlluminatiUserSchema);
