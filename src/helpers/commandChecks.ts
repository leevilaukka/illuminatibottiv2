import { Message } from "discord.js";
import { Config } from "../config";
import { IlluminatiClient } from "../structures";
import Command, { CommandArguments } from "../types/IlluminatiCommand";

export const commandChecks = async (client: IlluminatiClient, command: Command, message: Message, settings: any, args: CommandArguments, config: Config) => {
    // Not a command
    if (!command) {
        message.reply(
            `tuota komentoa ei löytynyt, kirjoita \`${settings.prefix}help\` saadaksesi apua komentojen kanssa.`
        );
        return false
    }
    // Command disabled
    if (command.outOfOrder && !client.isDevelopment) {
        message.reply(
            `tämä komento ei ole käytössä tällä hetkellä. Siinä on todennäköisesti jokin ongelma, tai sen koodaaminen on vielä kesken`
        );
        return false;
    }

    //Permissons check
    if (
        command.permissions &&
        message.channel.type !== "DM" &&
        !message.member.permissions.has(command.permissions)
    ) {
        message.reply("sinulla ei ole oikeuksia käyttää tätä komentoa");
        return false
    }

    //guildOnly check
    if (command.guildOnly && message.channel.type !== "GUILD_TEXT") {
        message.reply(
            "En voi suorittaa tätä komentoa yksityiskeskustelussa!"
        );
        return false
    }

    //ownerOnly check
    if (command.ownerOnly && message.author.id !== config.ownerID) {
        message.reply(
            "et omista minua! Komennon voi suorittaa vain tämän botin omistaja."
        );
        return false;
    }

    //Args check
    if (command.args && !args.length) {
        let reply = `Anna puuttuvat argumentit!`;

        if (command.usage) {
            reply += `\nOikea käyttötapa olisi: \`${settings.prefix}${command.name} ${command.usage}\``;
        }

        message.reply(reply);
        return false
    }

    // ArgTypes check
    if (command.argTypes) {
        for (let i = 0; i < command.argTypes.length; i++) {
            if (typeof (command.argTypes[i]) !== args[i]) {
                console.error(`${i}:n argumentin tyyppi on väärä, tyypin pitäisi olla ${command.argTypes[i]}, mutta se on ${typeof args[i]}`)
            }
            else continue
        }
    }

    return true
}