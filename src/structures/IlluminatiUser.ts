import Discord, { User } from "discord.js"
import IlluminatiClient from "./IlluminatiClient";
import IUser from "../models/User"
import IlluminatiEmbed from "./IlluminatiEmbed";

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
}

export type IlluminatiUserTypes = {
    discordID: string;
    username: string;
    stats: UserStats;
    data: IlluminatiUser;
}

export class IlluminatiUser extends User {
    constructor(client: IlluminatiClient, data: Discord.User) {
        super(client, data);
    }

    /**
     * Log user object
     */
    log() {
        console.log(this);
    }

    /**
     * Get user from database
     */
    async getUser() {
        const user = await IUser.findOne({ discordID: this.id })
        return user;
    }

    /**
     * Create new user to database
     */
    async createUser() {
        if (!(await this.getUser())?.discordID) {
            const user = new IUser({
                discordID: this.id,
                username: this.username,
            });

            await user.save().then((res) => {
                console.log(`Created user:`, res)
            });
        }
    }

    async updateUser(data: IlluminatiUserTypes) {
      
            const user = await this.getUser();
            if (typeof user !== "object") return console.error(`User does not exist:`, this.id);

            // Update user
            user.username = data.username;
            user.stats = {...user.stats, ...data.stats};
            user.save().then(() => {
                console.log(`Updated user:`, user);
            }).catch((e: any) => console.error(e));
        
    }
    /**
     * Update or create user
     * @param data Data to update user with
     */
    async updateOrCreateUser(data: IlluminatiUserTypes) {
        const user = await this.getUser();
        if (typeof user !== "object") {
            // No user found, create new user
            this.createUser();
        } else this.updateUser(data);
    }

    /**
     * Delete user from database
     */
    async deleteUser() {
        const user = await this.getUser();
        if (user) {
            await user.remove().then((res) => {
                console.log(`Deleted user:`, res)
            });
        } else {
            console.log(`User does not exist:`, this.id);
        }
    }

    /**
     * Update user stats
     * @param data Stats to update
     */

    async updateUserStats(data: UserStats) {
        const user = await this.getUser();
        if (user) {
            user.stats = { ...user.stats, ...data };
            await user.save().then((res) => {
                console.log(`Updated user stats:`, res)
            });
        } else {
            console.log(`User does not exist:`, this.id);
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

    async getStats() {
        const user = await this.getUser();
        if (user) {
            return user.stats;
        }
        return null;
    }

    /**
     * Add message to users message counter
     */

    async messageCountUp() {
        const user = await this.getUser();
        if (typeof user !== "object") return;
        user.stats.messageCount++;
        return user.save().catch((e: any) => console.error(e));
    }

    /**
     * Add money to user
     * @param amount Amount of money to add
     */

    async addMoney(amount: number) {
        const user = await this.getUser();
        if (typeof user !== "object") return;
        user.stats.money += amount;
        return user.save().catch((e: any) => console.error(e));
    }

    /** 
     * Trade money with other users
     * @param giveTo User to give money to
     * @param amount Amount to give
     * @param message Message object
     */

    async tradeMoney(giveTo: User, amount: number, message: Discord.Message) {
        if(giveTo.bot) return message.reply("älä tue bottien itsevaltaa!");
        
        const user = await this.getUser();
        const giveToUser = await IUser.findOne({ discordID: giveTo.id });

        if(!giveToUser) return message.reply("tuntematon käyttäjä! Pyydä käyttäjää lähettämään jokin viesti ja kokeile sitten uudelleen.");

        // Check object types
        if (typeof user !== "object") return;
        if (typeof giveToUser !== "object") return;

        // Check if user has enough money
        if (user.stats.money < amount) return message.reply("ei riittävästi varoja!");

        // Trade money
        user.stats.money -= amount;
        giveToUser.stats.money += amount;
         user.save().then(() => {
            giveToUser.save().then(() => {
                return message.channel.send(`${this.username} antoi ${amount} kolikkoa henkilölle ${giveTo.username}`);
            });
        }).catch((e: any) => console.error(e));
    }

    /**
     * Send users info as an embed
     * @param message Message object
     * @param client Client object
     */

    async sendInfo(message: Discord.Message, client: IlluminatiClient) {
        const user = await this.getUser();
        if (typeof user !== "object") return;
    
        new IlluminatiEmbed(message, {
            title: `${this.username} (${this.id})`,
            description: `**Käyttäjän tiedot**`,
            thumbnail: {
                url: this.displayAvatarURL({ size: 1024, dynamic: true }),
            },
            color: message.member.displayHexColor,
            fields: [
                {
                    name: "Lähetetyt viestit",
                    value: user.stats.messageCount,
                },
                {
                    name: "Raha",
                    value: `${user.stats.money} kolikkoa`,
                    inline: true,
                },
                {
                    name: "Taso",
                    value: `${user.stats.level}`,
                    inline: true,
                },
                {
                    name: "XP",
                    value: `${user.stats.xp} / ${user.stats.nextLevelXP}`,
                    inline: true,
                }
            ]
        }, client).send();
    }
}


