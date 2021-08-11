import Discord, { Message, User } from "discord.js"
import IUser from "../models/User"
import { IlluminatiEmbed, IlluminatiClient } from ".";
import { Document } from "mongoose";

type UserStats = {
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
    premium: boolean
}

export type IlluminatiUserTypes = {
    discordID: string;
    username: string;
    stats: UserStats;
}

export type UserFunctions = {
    log: (user: User) => void;
    getUser: (user: User) => Promise<IlluminatiUserTypes & Document<any, any, IlluminatiUserTypes>>;
    createUser: (user: User) => Promise<void>;
    updateUser: (user: User, data: IlluminatiUserTypes) => void;
    deleteUser: (user: User) => Promise<void>;
    updateOrCreateUser: (user: User, data: IlluminatiUserTypes) => void;
    getStats: (user: User) => Promise<UserStats>;
    messageCountUp: (user: User) => void;
    addMoney: (user: User, amount: number) => Promise<void | (IlluminatiUserTypes & Document<any, any, IlluminatiUserTypes>)>;
    tradeMoney: (user: User, giveTo: User, amount: number, message: Discord.Message) => Promise<Discord.Message>;
    sendInfo: (user: User, message: Discord.Message, client: IlluminatiClient) => Promise<Message>;
}
/**
 * Log user object
 */
export const log = (user: User) => {
    console.log(user);
}

/**
 * Get user from database
 */
export const getUser = async (user: User) => {
    const data = await IUser.findOne({ discordID: user.id })
    return data;
}

/**
 * Create new user to database
 */
export const createUser = async (user: User) => {
    if (!(await getUser(user))?.discordID) {
        const data = new IUser({
            discordID: user.id,
            username: user.username,
        });

        await data.save().then((res) => {
            console.log(`Created user:`, res)
        });
    }
}

export const updateUser = async (user: User, data: IlluminatiUserTypes) => {
    const userData = await getUser(user);
    if (typeof userData !== "object") return console.error(`User does not exist:`, user.id);

    // Update user
    userData.username = data.username;
    userData.stats = { ...userData.stats, ...data.stats };
    userData.save().then(() => {
        console.log(`Updated user:`, user);
    }).catch((e: any) => console.error(e));
}
/**
 * Update or create user
 * @param data Data to update user with
 */
export const updateOrCreateUser = async (user: User, data: IlluminatiUserTypes) => {
    const userData = await getUser(user);
    if (typeof userData !== "object") {
        // No user found, create new user
        createUser(user);
    } else updateUser(user, data);
}

/**
 * Delete user from database
 */
export const deleteUser = async (user) => {
    const userData = await getUser(user);
    if (userData) {
        await userData.remove().then((res) => {
            console.log(`Deleted user:`, res)
        });
    } else {
        console.log(`User does not exist:`, user.id);
    }
}

/**
 * Update user stats
 * @param data Stats to update
 */

export const updateUserStats = async (user: User, data: UserStats) => {
    const userData = await getUser(user);
    if (userData) {
        userData.stats = { ...userData.stats, ...data };
        await userData.save().then((res) => {
            console.log(`Updated user stats:`, res)
        });
    } else {
        console.log(`User does not exist:`, user.id);
    }
}

/*
async logCommandUse(command: string) {
    const user = await IUser.findOne({ discordID: this.id });
    if (user) {
        if (!user.stats.commandsUsed[command]) {
            user.stats.commandsUsed[command].count = 1;
        } else {
            user.stats.commandsUsed[command].count++;
        }

        await user.save().then((res) => {
            console.log(`Updated user stats:`, res)
        })
    } else {
        console.log(`User does not exist:`, this.id)
    };
}*/

/**
 * Get user stats
 */

export const getStats = async (user: User) => {
    const userData = await getUser(user);
    if (userData) {
        return userData.stats;
    }
    return null;
}

/**
 * Add message to users message counter
 */

export const messageCountUp = async (user: User) => {
    const userData = await getUser(user);
    if (typeof user !== "object") return;
    userData.stats.messageCount++;
    return userData.save().catch((e: any) => console.error(e));
}

/**
 * Add money to user
 * @param amount Amount of money to add
 */

export const addMoney = async (user: User, amount: number) => {
    const userData = await getUser(user);
    if (typeof user !== "object") return;
    userData.stats.money += amount;
    return userData.save().catch((e: any) => console.error(e));
}

/** 
 * Trade money with other users
 * @param giveTo User to give money to
 * @param amount Amount to give
 * @param message Message object
 */

export const tradeMoney = async (user: User, giveTo: User, amount: number, message: Discord.Message) => {
    if (giveTo.bot) return message.reply("älä tue bottien itsevaltaa!");

    const data = await getUser(user);
    const giveToUser = await IUser.findOne({ discordID: giveTo.id });

    if (!giveToUser) return message.reply("tuntematon käyttäjä! Pyydä käyttäjää lähettämään jokin viesti ja kokeile sitten uudelleen.");

    // Check object types
    if (typeof data !== "object") return;
    if (typeof giveToUser !== "object") return;

    // Check if user has enough money
    if (data.stats.money < amount) return message.reply("ei riittävästi varoja!");

    // Trade money
    data.stats.money -= amount;
    giveToUser.stats.money += amount;
    data.save().then(() => {
        giveToUser.save().then(() => {
            return message.channel.send(`${user.username} antoi ${amount} kolikkoa henkilölle ${giveTo.username}`);
        });
    }).catch((e: any) => console.error(e));
}

/**
 * Send users info as an embed
 * @param message Message object
 * @param client Client object
 */

export const sendInfo = async (user: User, message: Discord.Message, client: IlluminatiClient) => {
    const userData = await getUser(user);
    if (typeof userData !== "object") return;

    return new IlluminatiEmbed(message, {
        title: `${user.username} (${user.id})`,
        description: `**Käyttäjän tiedot**`,
        thumbnail: {
            url: user.displayAvatarURL({ size: 1024, dynamic: true }),
        },
        color: message.member.displayHexColor,
        fields: !user.bot ? [
            {
                name: "Lähetetyt viestit",
                value: userData.stats.messageCount.toString(),
            },
            {
                name: "Raha",
                value: `${userData.stats.money} kolikkoa`,
                inline: true,
            },
            {
                name: "Taso",
                value: `${userData.stats.level}`,
                inline: true,
            },
            {
                name: "XP",
                value: `${userData.stats.xp} / ${userData.stats.nextLevelXP}`,
                inline: true,
            },
        ] : [
            {
                name: "Botti",
                value: `:robot:`,
            },
        ]
    }, client).send();
}

export default {log, createUser, getStats, sendInfo, addMoney, messageCountUp, tradeMoney, updateUserStats, getUser, updateUser, updateOrCreateUser, deleteUser};