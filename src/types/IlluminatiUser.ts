import { Message } from "discord.js"
import { IlluminatiClient } from "../structures"

export type IlluminatiUser = {
    discordID: string;
    stats?: UserStats;
    data?: IlluminatiUser;
    log: () => void;
    getUser: () => IlluminatiUser;
    createUser: () => void;
    updateUserStats: (stats: UserStats) => void;
    deleteUser: () => void;
    getStats: () => UserStats;
    logCommandUse: (command: string) => void;
    messageCountUp: () => void;
    addMoney: (amount: number) => void;
    tradeMoney: (giveTo:IlluminatiUser, amount: number, message: Message) => void;
    sendInfo: (message: Message, client: IlluminatiClient) => void;
} 

export type UserStats = {
    money: number;
    level: number;
    xp: number;
    nextLevelXP: number;
    messageCount: number;
    commandsUsed: [
        {
            command: string;
            count: number;
        }
    ]
}
    