import { GuildSettings } from '../../../config';

import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: "config",
    description: "Tarkastele ja vaihda botin asetuksia palvelimellasi",
    guildOnly: true,
    aliases: ["asetus", "asetukset"],
    permissions: ["MANAGE_GUILD"],
    category: Categories.config,
    async run(message, args: string[], settings, client, { guild }) {
        const setting = args[0] as keyof GuildSettings;

        if (!setting) return message.channel.send("Anna asetus!");

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