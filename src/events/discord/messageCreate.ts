import { IlluminatiClient } from "../../structures";

import Discord, { Collection, Message } from "discord.js";
import config, { GuildSettings } from "../../config";
import messageCheck from "../../helpers/messageCheck";
import { commandChecks } from "../../helpers/commandChecks";

const cooldowns: Collection<string, Collection<string, number>> = new Discord.Collection();

export default async (client: IlluminatiClient, message: Message) => {
    let settings: GuildSettings;

    try {
        if (message.channel.type === "DM") {
            settings = client.config.defaultSettings;
        } else {
            settings = await client.guildManager.getGuild(message.guild);
        }
    } catch (e) {
        client.logger.botError(e, message);
    }

    if (message.author.bot) return;

    const user = await client.userManager.createUser(message.author);

    

    if (user) client.userManager.messageCountUp(message.author);

    if (settings.randomMessages) messageCheck(message);

    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(settings.prefix)})\\s*`
    );

    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args: string[] = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = await client.getCommand(commandName)

    commandChecks(client, command, message, settings, args, config).then(async (res) => {
        if (res) {
            //Cooldowns
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            //Timestamps
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            //Cooldown check
            if (!user.stats.premium) {
                if (timestamps.has(message.author.id)) {
                    const expirationTime =
                        timestamps.get(message.author.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return message.reply(
                            `odota ${timeLeft.toFixed(1)} sekunti(a) ennen kuin käytät \`${command.name
                            }\` komentoa uudestaan.`
                        );
                    }
                }

                // Set cooldown timestamp
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }

            // Log command usage
            if (client.isDevelopment) console.log(`Cmd ${command.name} called!`);

            //Execute command and catch errors
            try {
                message.channel.sendTyping();
                command.execute(message, args, settings, client);
            } catch (error) {
                client.logger.botError(error, message, command);
            }
        } else return
    });
};


