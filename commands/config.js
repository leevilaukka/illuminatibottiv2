module.exports = {
    name: "config",
    description: "",
    guildOnly: true,
    aliases: ["asetus", "asetukset"],
    async execute(message, args, settings, client) {
        if (!message.member.hasPermission("MANAGE_GUILD")) return;

        const setting = args[0];
        const newSetting = args.slice(1).join(" ");

        switch (setting) {
            case "prefix": {
                if (!newSetting) {
                    return message.channel.send(`Nykyinen prefix:\`${settings.prefix}\``)
                }
                try{
                    await client.updateGuild(message.guild, { prefix: newSetting});
                    message.channel.send("Prefiksi päivitetty");
                }catch (e) {
                    message.channel.send(`Tapahtui virhe: ${e.message}`)
                }
                break;
            }
            default:{
                const embed = {
                    title: "Kaikki botin asetukset",
                    description: "Voit vaihtaa asetusta antamalla asetuksen nimen ja uuden arvon. Tässä nykyiset arvot",
                    fields: [
                        {
                            name: "Prefix",
                            value: `\`${settings.prefix}\``
                        }
                    ]
                };
                return message.channel.send({embed})
            }
        }

    }
};