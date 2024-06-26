import {
    CommandError,
    ErrorWithStack,
    UserError,
} from "../../structures/Errors";
import Discord, { ChannelType, Collection, Message, User } from "discord.js";
import config, { GuildSettings } from "../../config";
import { commandChecks } from "../../helpers/commandChecks";
import messageCheck from "../../helpers/messageCheck";
import { IlluminatiClient } from "../../structures";
import { PlayerMetadata } from "PlayerMetadata";
import { Command } from "../../types";

const cooldowns: Collection<
    Command["name"],
    Collection<User["id"], number /*time*/>
> = new Discord.Collection();

export default async (client: IlluminatiClient, message: Message) => {
    if (message.author.bot) return;

    let settings: GuildSettings;

    const { user, guild } = await client.getManagersFromMessage(message);

    try {
        if (message.channel.type === ChannelType.DM) {
            settings = client.config.defaultSettings;
        } else {
            settings = await guild.getGuild();
        }
    } catch (e) {
        throw new ErrorWithStack(e);
    }

    if(!user.getUser()) await user.createUser();

    await user.messageCountUp();

    if (settings.randomMessages) messageCheck(message);

    // Regex for mention
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(settings.prefix)})\\s*`
    );

    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args: any = message.content
        .slice(matchedPrefix.length)
        .trim()
        .split(/ +/);
    const commandName = args.shift().toLowerCase() as Command["name"];

    const command = IlluminatiClient.getCommand(commandName);

    commandChecks(client, command, message, settings, args, config)
        .then(async (res) => {
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
                        const expirationTime =
                            timestamps.get(message.author.id) + cooldownAmount;

                        if (now < expirationTime) {
                            const timeLeft = (expirationTime - now) / 1000;
                            return message.reply(
                                `odota ${timeLeft.toFixed(
                                    1
                                )} sekunti(a) ennen kuin käytät \`${
                                    command.name
                                }\` komentoa uudestaan.`
                            );
                        }
                    }

                    // Set cooldown timestamp
                    timestamps.set(message.author.id, now);
                    setTimeout(
                        () => timestamps.delete(message.author.id),
                        cooldownAmount
                    );
                }

                // Command call event
                client.events.emit("commandCall", command);

                const queue = client.player.nodes.get<PlayerMetadata>(message.guild);

                client.lastMessage = message;

                //Execute command and catch errors
                try {
                    message.channel.sendTyping();
                    await command
                        .run(message, args, settings, client, { guild, user, queue })
                        .then(() => {
                            user.addCommandUse(command.name);
                            client.events.emit("commandExec", command)
                            if (command.cleanUp) command.cleanUp(client)
                        })
                        .catch(async (error) => {
                            throw error;
                        });
                } catch (error) {
                    console.error(error);
                    if (error instanceof ErrorWithStack)
                        return client.sendError(
                            error,
                            message.channel,
                            settings.stacksEnabled
                        );
                    if (error instanceof UserError)
                        return client.sendError(error, message);

                    return client.sendError(error, message);
                }
            }
        })
        .catch(async (err) => {
            client.sendError(err, message.channel);
        });
};
