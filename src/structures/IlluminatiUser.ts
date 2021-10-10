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
    premium: boolean,
    dailyStreak: number,
    lastCommand: Date | null,
}

export type IlluminatiUserTypes = {
    discordID: string;
    username: string;
    stats: UserStats;
}

type UserPromise = Promise<Document<any, any, IlluminatiUserTypes> & IlluminatiUserTypes>


export const UserFunctions = (user: User) => {
    return {
        /**
         * Returns Discord User Object
         * @returns {Discord.User}
         */
        getDiscordUser: (): Discord.User => user,

        /**
         * Log user object
         */
        logUser: () => {
            console.log(user);
        },

        /**
         * Get user from database
         */
        getUser: async (): UserPromise => {
            return await IUser.findOne({ discordID: user.id })
        },

        /**
         * Create new user to database
         */
        createUser: async (): UserPromise => {
            if (!(await UserFunctions(user).getUser())?.discordID) {
                const data = new IUser({
                    discordID: user.id,
                    username: user.username,
                });

                await data.save().then(async (res) => {
                    const user = res;
                    return user;
                });
            } else return await UserFunctions(user).getUser();
        },

        updateUser: async (data: IlluminatiUserTypes): Promise<void | UserPromise> => {
            const userData = await UserFunctions(user).getUser();
            if (typeof userData !== "object") return console.error(`User does not exist:`, user.id);

            // Update user
            userData.username = data.username;
            userData.stats = { ...userData.stats, ...data.stats };
            return userData.save().then(async (res) => {
                const result = res;
                return result;
            }).catch(() => console.error(`Failed to update user:`, user.id));
        },

        /**
         * Update or create user
         * @param data Data to update user with
         */
        updateOrCreateUser: async (data: IlluminatiUserTypes): Promise<void | UserPromise> => {
            const userData = await UserFunctions(user).getUser();
            if (typeof userData !== "object") {
                // No user found, create new user
                return UserFunctions(user).createUser();
            } else return UserFunctions(user).updateUser(data);
        },

        /**
         * Delete user from database
         */
        deleteUser: async (): Promise<void> => {
            const userData = await UserFunctions(user).getUser();
            if (userData) {
                await userData.remove().then((res) => {
                    console.log(`Deleted user:`, res)
                });
            } else {
                console.log(`User does not exist:`, user.id);
            }
        },

        /**
         * Update user stats
         * @param data Stats to update
         */

        updateUserStats: async (data: UserStats): Promise<void | UserPromise> => {
            const userData = await UserFunctions(user).getUser();
            if (userData) {
                userData.stats = { ...userData.stats, ...data };
                await userData.save().then(async (res) => {
                    return res
                });
            } else {
                console.log(`User does not exist:`, user.id);
            }
        },

        checkDailyStreak: async (): Promise<boolean> => {
            const userData = await UserFunctions(user).getUser();
            if (userData) {
                const lastCommand = userData.stats.lastCommand;
                if (lastCommand) {
                    const now = new Date();
                    const diff = now.getTime() - lastCommand.getTime();
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    if (days === 0) return true;
                    else return false;
                }
            }
        },

        updateLastCommand: async (): Promise<void | UserPromise> => {
            const userData = await UserFunctions(user).getUser();
            if (userData) {
                userData.stats.lastCommand = new Date();
                await userData.save().then(async (res) => {
                    return res
                });
            } else {
                console.log(`User does not exist:`, user.id);
            }
        },

        updateDailyStreak: async (): Promise<void | UserPromise> => {
            const userData = await UserFunctions(user).getUser();
            if (userData && await UserFunctions(user).checkDailyStreak()) {
                userData.stats.dailyStreak = userData.stats.dailyStreak + 1;
                await userData.save().then(async (res) => {
                    return res
                });
            } else {
                console.log(`User does not exist:`, user.id);
            }
        },

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

        getStats: async (): Promise<UserStats> => {
            const userData = await UserFunctions(user).getUser();
            if (userData) {
                return userData.stats;
            }
            return null;
        },

        /**
         * Add message to users message counter
         */

        messageCountUp: async (): Promise<void | UserPromise> => {
            const userData = await UserFunctions(user).getUser();
            if (typeof user !== "object") return;
            userData.stats.messageCount++;
            return userData.save().catch((e: any) => console.error(e));
        },

        /**
         * Add money to user
         * @param amount Amount of money to add
         */
        addMoney: async (amount: number): Promise<void | UserPromise> => {
            const userData = await UserFunctions(user).getUser();
            if (typeof user !== "object") return;
            userData.stats.money += amount;
            return userData.save().catch((e: string) => {
                console.error(e);
            });
        },

        /** 
         * Trade money with other users
         * @param giveTo User to give money to
         * @param amount Amount to give
         * @param message Message object
         */

        tradeMoney: async (giveTo: User, amount: number, message: Discord.Message): Promise<Message | UserPromise[]> => {
            if (giveTo.bot) return message.reply("älä tue bottien itsevaltaa!");

            const data = await UserFunctions(user).getUser();
            const giveToUser = await UserFunctions(giveTo).getUser();

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
                    message.channel.send(`${user.username} antoi ${amount} kolikkoa henkilölle ${giveTo.username}`);
                });

                return [data, giveToUser];
            }).catch((e: any) => console.error(e));
        },

        /**
         * Send users info as an embed
         * @param message Message object
         * @param client Client object
         */

        sendInfo: async (message: Discord.Message, client: IlluminatiClient): Promise<Discord.Message> => {
            const userData = await UserFunctions(user).getUser();
            if (typeof userData !== "object") return;

            return new IlluminatiEmbed(message, client, {
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
            }).send();
        },

        givePremium: async (): UserPromise => {
            const userData = await UserFunctions(user).getUser();
            if (typeof userData !== "object") return;

            userData.stats.premium = true;
            return await userData.save()
        }
    }
}

export default UserFunctions;