module.exports = {
    name: "config",
    description: "Tarkastele ja vaihda botin asetuksia palvelimellasi",
    guildOnly: true,
    aliases: ["asetus", "asetukset"],
    permissions: ["MANAGE_GUILD"],
    category: "config",
    async execute(message, args, settings, client) {
        const setting = args[0];
        let newSetting = args.slice(1).join(" ");

        switch (setting) {
            case "prefix": {
                if (!newSetting) {
                    return message.channel.send(`Nykyinen prefix:\`${settings.prefix}\``)
                }
                try {
                    await client.updateGuild(message.guild, {
                        prefix: newSetting
                    });
                    message.channel.send("Prefiksi päivitetty");
                } catch (e) {
                    message.channel.send(`Tapahtui virhe: ${e.message}`)
                }
                break;
            }
            case "volume":
                if (!newSetting) {
                    return message.channel.send(`Nykyinen oletusäänenvoimakkuus:\`${settings.volume}\``)
                }
                try {
                    if (newSetting > 2) {
                        newSetting = 2;
                        message.channel.send("Asetus liian suuri, äänenvoimakkuus rajoitettu 200%")
                    }
                    await client.updateGuild(message.guild, {
                        volume: newSetting
                    });
                    message.channel.send("Oletusäänenvoimakkuus päivitetty");
                } catch (e) {
                    message.channel.send(`Tapahtui virhe: ${e.message}`)
                }
                break;
            default: {
                const embed = {
                    title: "Kaikki botin asetukset",
                    description: "Voit vaihtaa asetusta antamalla asetuksen nimen ja uuden arvon. Tässä nykyiset arvot",
                    fields: [
                        {
                            name: "Prefix",
                            value: `\`${settings.prefix}\``,
                            inline: true
                        },
                        {
                            name: "Oletusäänenvoimakkuus",
                            value: `\`${(settings.volume * 100).toFixed(1)} %\``,
                            inline: true
                        }
                    ]
                };
                return message.channel.send({embed})
            }
        }
    }
};