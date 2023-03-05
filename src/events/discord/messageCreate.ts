import { CommandError, ErrorWithStack, UserError } from '../../structures/Errors';
import Discord, { ChannelType, Collection, Message } from "discord.js";
import config, { GuildSettings } from "../../config";
import { commandChecks } from "../../helpers/commandChecks";
import messageCheck from "../../helpers/messageCheck";
import { IlluminatiClient } from "../../structures";
import { Guild } from '../../models';
import { cp } from 'fs';
import { commandCounter } from '../../metrics';

const cooldowns: Collection<string /*command name*/, Collection<string /*user*/, number /*time*/>> = new Discord.Collection();

export default async (client: IlluminatiClient, message: Message) => {
    if (message.author.bot) return;

    let settings: GuildSettings;

    const { user, guild } = client.getManagersFromMessage(message);

    try {
        if (message.channel.type === ChannelType.DM) {
            settings = client.config.defaultSettings;
        } else {
            settings = await guild.getGuild();
        }
    } catch (e) {
       throw new ErrorWithStack(e);
    }


    if (await user.getUser()) await user.messageCountUp();

    if (settings.randomMessages) await messageCheck(message);

    // Regex for mention
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(settings.prefix)})\\s*`);

    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args: string[] = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = IlluminatiClient.getCommand(commandName)

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
            if (!(await user.getStats()).premium) {
                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        return message.reply(`odota ${timeLeft.toFixed(1)} sekunti(a) ennen kuin käytät \`${command.name}\` komentoa uudestaan.`);
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
                await command.run(message, args, settings, client, {guild, user})
                    .then(() => {
                        if (client.isDevelopment) console.log(`Cmd ${command.name} executed!`);
                        commandCounter.inc();
                    })
                    .catch(async (error) => {
                        throw error
                    });
            } catch (error) {
                console.error(error);

                /* if (error instanceof CommandError) {
                    console.log(`Command ${error.command.name} errored!`)
        
                    const guildData = await Guild.findOne({id: message.guild.id});
        
                    if (guildData) {
                        const errorCount: number = guildData.get(`commandErrors.${error.command.name}`) || 0;
        
                        guildData.set(`commandErrors.${error.command.name}`, errorCount + 1);
                        guildData.save();
                    }
                } */

                if (error instanceof ErrorWithStack) return client.sendError(error, message.channel, settings.stacksEnabled);
                if (error instanceof UserError) return client.sendError(error, message);

                return client.sendError(error, message);
            }
        }
    }).catch(async err => {
        client.sendError(err, message.channel);
    })
}