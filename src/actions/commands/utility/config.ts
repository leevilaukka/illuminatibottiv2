import { GuildSettings } from '../../../config';
import { IlluminatiEmbed } from '../../../structures';

import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: "config",
    description: "Tarkastele ja vaihda botin asetuksia palvelimellasi",
    guildOnly: true,
    aliases: ["asetus", "asetukset"],
    permissions: ["ManageGuild"],
    category: Categories.config,
    async run(message, args: string[], settings, client, { guild }) {
        const setting = args[0] as keyof GuildSettings;
        console.log(settings)
        
        const embed =  new IlluminatiEmbed(message, client, {
            title: "Asetukset",
            description: "`<asetus> <arvo>` komentoa vaihtaaksesi asetuksia",
            fields: [
                {
                    name: "Äänenvoimakkuus",
                    value: `${settings.volume * 100}%`,
                    inline: true
                },
                {
                    name: "Prefix",
                    value: settings.prefix,
                    inline: true
                },
                {
                    name: "Satunnaiset viestit",
                    value: settings.randomMessages ? "Käytössä" : "Ei käytössä",
                    inline: true
                },
                {
                    name: "Estetyt komennot",
                    value: settings.disabledCommands.length ? settings.disabledCommands.join(", ") : "Ei estettyjä komentoja",
                    inline: true
                },
                {
                    name: "Leave on empty",
                    value: settings.leaveOnEmpty ? "Käytössä" : "Ei käytössä",
                }
            ]
        })

        if (!setting) return embed.send()

        let newSetting = args.slice(1).join(" ");

        if (!newSetting) {
            return message.channel.send(`Nykyinen ${setting}: \`${settings[setting]}\``)
        } else {
            guild.changeSetting(setting, newSetting).then((res) => {
                message.channel.send(res)
            })
        }
    }
}

export default command;