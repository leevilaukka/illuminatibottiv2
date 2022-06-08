import { CommandNotFoundError } from '../structures/Errors';
import { Message } from "discord.js";
import { Config } from "../config";
import { IlluminatiClient } from "../structures";
import Command, { CommandArguments } from "../types/IlluminatiCommand";

// Check if command can be run
export const commandChecks = async (client: IlluminatiClient, command: Command, message: Message, settings: any, args: CommandArguments, config: Config) => {
    // Not a command
    if (!command) {
        throw new CommandNotFoundError(`tuota komentoa ei löytynyt, kirjoita \`${settings.prefix}help\` saadaksesi apua komentojen kanssa.`)
    }
    // Command disabled
    if (command.outOfOrder && !client.isDevelopment) {
        throw `tämä komento ei ole käytössä tällä hetkellä. Siinä on todennäköisesti jokin ongelma, tai sen koodaaminen on vielä kesken`;
    }

    if(await client.guildManager(message.guild).isCommandDisabled(command.name)) {
        throw `tämä komento on estetty tällä palvelimella.`
    }

    //Permissons check
    if (
        command.permissions &&
        message.channel.type !== "DM" &&
        !message.member.permissions.has(command.permissions)
    ) {
        throw "sinulla ei ole oikeuksia käyttää tätä komentoa"
    }

    //guildOnly check
    if (command.guildOnly && message.channel.type !== "GUILD_TEXT") {
        throw "En voi suorittaa tätä komentoa yksityiskeskustelussa!"
    }

    //ownerOnly check
    if (command.ownerOnly && message.author.id !== config.ownerID) {
        throw `Tämän komennon voi suorittaa vain tämän botin omistaja, ${(await client.getOwner()).tag} .`
    }

    //Args check
    if (command.args && !args.length) {
        let reply = `Anna puuttuvat argumentit!`;

        if (command.usage) {
            reply += `\nOikea käyttötapa olisi: \`${settings.prefix}${command.name} ${command.usage}\``;
        }

        throw reply;
    }

    return true
}