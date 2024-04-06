import Discord, { InteractionResponse, Message, User } from "discord.js"
import IUser from "../models/User"
import { IlluminatiClient, IlluminatiEmbed } from ".";
import { Document } from "mongoose";
import { BotError, DatabaseError } from "./Errors";
import { time } from "@discordjs/builders";
import { RawUserData } from "discord.js/typings/rawDataTypes";

type MusicQuizStats = Partial<{
    correctAnswers: number;
    incorrectAnswers: number;
    totalAnswers: number;
    totalPoints: number;
        totalGames: number;
    totalWins: number;
}>;

type TradeInitiator = Discord.Message | Discord.ChatInputCommandInteraction;

type UserStats = {
    money: number;
    experience: {
        level: number;
        xp: number;
        nextLevelXP: number;
    }
    messageCount: number;
    lastMessageAt: Date;
    commandsUsed: Map<string, number>;
    premium: boolean,
    dailyStreak: number,
    lastCommand: Date | null,
    birthday: Date | null,
    musicQuiz: MusicQuizStats;
}

export type IlluminatiUserTypes = {
    discordID: string;
    username: string;
    stats: UserStats;
    discordAuth: {
        token_type: string,
        access_token: string,
        expires_in: number,
        refresh_token: string,
        scope: string
    }
}

type UserPromise = Promise<Document<any, any, IlluminatiUserTypes> & IlluminatiUserTypes>


class IlluminatiUser<T extends User> extends Discord.User {
    user: T;
    userData: UserPromise;

    constructor(user: T) {
        super(user.client, user.toJSON() as RawUserData);

        this.user = user;
        this.userData = this.getUser();
    }

    logUser(): void {
        console.log(this.user);
    }

    async getUser(): UserPromise {
        return IUser.findOne({ discordID: this.user.id })
            .catch((e) => {
                throw new DatabaseError(e);
            });
    }

    async createUser(): UserPromise {
        if (!(await this.userData).discordID) {
            const data = new IUser({
                discordID: this.user.id,
                username: this.user.username,
            });
            
            await data.save().then(async (res) => {
                return res;
            });
        } else return await this.getUser();
        return null;
    }
        
    async updateUser(data: Partial<IlluminatiUserTypes>): Promise<void | UserPromise> {
        const userData = await this.userData;
        if (typeof userData !== "object") throw new BotError(`User does not exist: ${this.user.id}`);

        // Update user
        userData.username = data.username;
        userData.stats = { ...userData.stats, ...data.stats };
        return userData.save().then(async (res) => {
            return res;
        }).catch((e) => {
            throw new DatabaseError(e)
        });
    }

    /**
         * Update or create user
         * @param data Data to update user with
         */
    async updateOrCreateUser (data: IlluminatiUserTypes): Promise<void | UserPromise>{
        const userData = await this.getUser();
        if (typeof userData !== "object") {
            // No user found, create new user
            return this.createUser();
        } else return this.updateUser(data);
    }

    /**
     * Delete user from database
     */
    
    async deleteUser(): Promise<void> {
        const userData = await this.getUser();
        if (userData) {
            await userData.remove().then((res) => {
                console.log(`Deleted user:`, res)
            }).catch((e) => {
                throw new DatabaseError(e)
            });
        } else {
            throw new BotError(`User does not exist: ${this.user.id}`);
        }
    }

    /**
     * Update user stats
     * @param data Stats to update
     */

    async updateUserStats(data: Partial<UserStats>): Promise<void | UserPromise> {
        const userData = await this.getUser();
        if (userData) {
            userData.stats = { ...userData.stats, ...data };
            await userData.save().then(async (res) => {
                return res
            }).catch((e) => {
                throw new DatabaseError(e)
            });
        } else {
            throw new BotError(`User does not exist: ${this.user.id}`);
        }
    }

    async checkDailyStreak (): Promise<boolean> {
        const userData = await this.getUser();
        if (userData) {
            const lastCommand = userData.stats.lastCommand;
            if (lastCommand) {
                const now = new Date();
                const diff = now.getTime() - lastCommand.getTime();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                return days === 0;
            }
        } 
        return false;
    }

    async updateLastCommand(): Promise<void | UserPromise> {
        const userData = await this.getUser();
        if (userData) {
            userData.stats.lastCommand = new Date();
            await userData.save().then(async (res) => {
                return res
            });
        } else {
            throw new BotError(`User does not exist: ${this.user.id}`);
        }
    }

    async updateDailyStreak(): Promise<void | UserPromise> {
        const userData = await this.getUser();
        if (userData && await this.checkDailyStreak()) {
            userData.stats.dailyStreak = userData.stats.dailyStreak + 1;
            await userData.save().then(async (res) => {
                return res
            });
        } else {
            throw new BotError(`User does not exist: ${this.user.id}`);
        }
    }

    /**
     * Get user stats
     */

    async getStats(): Promise<UserStats> {
        const userData = await this.getUser();
        if (userData) {
            return userData.stats;
        }
        return null;
    }

    /**
     * Add message to users message counter
     */

    

    async messageCountUp(): Promise<void | UserPromise> {
        const userData = await this.getUser();
        if (typeof userData !== "object") return;
        userData.stats.messageCount++;
        userData.stats.lastMessageAt = new Date()
        
        return userData.save().catch((e: any) => {
            throw new DatabaseError(e)
        });
    }

    async setLastMessageAt(message: Message) {
        const userData = await this.getUser();
        if (typeof userData !== "object") return;
        userData.stats.lastMessageAt = message.createdAt;
        
        return userData.save().catch((e: any) => {
            throw new DatabaseError(e)
        });
    }

    /**
     * Add money to user
     * @param amount Amount of money to add
     */
    async addMoney(amount: number): Promise<void | UserPromise> {
        const userData = await this.getUser();
        if (typeof userData !== "object") return;
        userData.stats.money += amount;
        return userData.save().catch((e: string) => {
            throw new DatabaseError(e)
        });
    }

    async addCommandUse(command: string): Promise<void | UserPromise> {
        const userData = await this.getUser();

        if (typeof userData !== "object") return;

        const count = userData.stats.commandsUsed.get(command);

        if (count) {
            userData.stats.commandsUsed.set(command, count + 1);
        } else {
            userData.stats.commandsUsed.set(command, 1);
        }

        return userData.save().catch((e: string) => {
            throw new DatabaseError(e)
        });
    }


    /** 
     * Trade money with other users
     * @param giveTo User to give money to
     * @param amount Amount to give
     * @param message Message object
     */
    async tradeMoney<T extends TradeInitiator>(giveTo: User, amount: number, initiator: T): UserPromise {
        if (giveTo.bot) throw new Error("Et voi antaa rahaa botille!");

        const data = await this.getUser();
        const giveToUser = await new IlluminatiUser(giveTo).getUser();

        if (!giveToUser) throw new Error("tuntematon käyttäjä! Pyydä käyttäjää lähettämään jokin viesti ja kokeile sitten uudelleen.");

        // Check object types
        if (typeof data !== "object" || typeof giveToUser !== "object") return;

        // Check if user has enough money
        if (data.stats.money < amount) throw new Error("ei riittävästi varoja!");

        // Trade money
        data.stats.money -= amount;
        giveToUser.stats.money += amount;
        data.save().then(() => {
            giveToUser.save().then(() => {
                initiator.channel.send(`${this.user.username} antoi ${amount} kolikkoa henkilölle ${giveTo.username}`);
            });

            return [data, giveToUser];
        }).catch((e: Error) => {
            initiator.reply(e.message);
        });
    }

    /**
     * Send users info as an embed
     * @param message Message object
     * @param client Client object
     */

    async infoAsEmbed(message: Discord.Message, client: IlluminatiClient): Promise<IlluminatiEmbed> {
        const userData = await this.getUser();
        if (typeof userData !== "object") return;

        return new IlluminatiEmbed(message, client, {
            title: `${this.user.username} (${this.user.id})`,
            description: `**Käyttäjän tiedot**`,
            thumbnail: {
                url: this.user.displayAvatarURL(),
            },
            fields: !this.user.bot ? [
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
                    value: `${userData.stats.experience.level}`,
                    inline: true,
                },
                {
                    name: "XP",
                    value: `${userData.stats.experience.xp} / ${userData.stats.experience.nextLevelXP}`,
                    inline: true,
                },
                {
                    name: "Liittyi Discordiin",
                    value: `${time(this.user.createdAt)}`,
                },
            ] : [
                {
                    name: "Botti",
                    value: `:robot:`,
                },
            ]
        });
    }

    async givePremium(): UserPromise {
        const userData = await this.getUser();
        if (typeof userData !== "object") return;

        userData.stats.premium = true;
        return await userData.save().catch((e: any) => {
            throw new DatabaseError(e)
        });
    }

    async removePremium(): UserPromise {
        const userData = await this.getUser();
        if (typeof userData !== "object") return;

        userData.stats.premium = false;
        return await userData.save().catch((e: any) => {
            throw new DatabaseError(e)
        });
    }
}

export default IlluminatiUser;