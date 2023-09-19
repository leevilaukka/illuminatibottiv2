import {
    BotError,
    CommandError,
    CommandNotFoundError,
    UserError,
} from "../structures/Errors";
import { ChannelType, Message } from "discord.js";

import { IlluminatiClient } from "../structures";
import { CommandArguments, Command } from "../types";
import { Config } from "../config";

// Check if command can be run
export const commandChecks = async (
    client: IlluminatiClient,
    command: Command,
    message: Message,
    settings: any,
    args: CommandArguments,
    config: Config
) => {
    // Not a command
    if (!command) {
        throw new CommandNotFoundError(
            `tuota komentoa ei löytynyt, kirjoita \`${settings.prefix}help\` saadaksesi apua komentojen kanssa.`
        );
    }
    // Command disabled
    if (command.outOfOrder) {
        throw new CommandError(
            `tämä komento ei ole käytössä tällä hetkellä. Siinä on todennäköisesti jokin ongelma, tai sen koodaaminen on vielä kesken`,
            command
        );
    }

    if (
        await new client.guildManager(message.guild).isCommandDisabled(command.name)
    ) {
        throw new UserError(`tämä komento on estetty tällä palvelimella.`);
    }

    //Permissons check
    if (
        command.permissions &&
        message.channel.type !== ChannelType.DM &&
        !message.member.permissions.has(command.permissions)
    ) {
        throw new UserError("sinulla ei ole oikeuksia käyttää tätä komentoa");
    }

    //guildOnly check
    if (command.guildOnly && message.channel.type !== ChannelType.GuildText) {
        throw new UserError(
            "En voi suorittaa tätä komentoa yksityiskeskustelussa!"
        );
    }

    //ownerOnly check
    if (command.ownerOnly && message.author.id !== config.ownerID) {
        throw new UserError(
            `Tämän komennon voi suorittaa vain tämän botin omistaja, ${
                (await client.owner).tag
            } .`
        );
    }

    //Args check
    if (command.args && !args.length) {
        let reply = `Anna puuttuvat argumentit!`;

        if (command.usage) {
            reply += `\nOikea käyttötapa olisi: \`${settings.prefix}${command.name} ${command.usage}\``;
        }

        throw new UserError(reply);
    }

    return true;
};
