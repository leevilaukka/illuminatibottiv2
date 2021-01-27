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
    const author = {
      name: "IlluminatiBotti",
      icon_url: client.user.avatarURL(),
    };

    switch (setting) {
      case "prefix": {
        if (!newSetting) {
          return message.channel.send(`Nykyinen prefix:\`${settings.prefix}\``);
        }
        try {
          await client.updateGuild(message.guild, {
            prefix: newSetting,
          });
          message.channel.send("Prefiksi päivitetty");
        } catch (e) {
          message.channel.send(`Tapahtui virhe: ${e.message}`);
        }
        break;
      }
      case "volume":
        if (!newSetting) {
          return message.channel.send(
            `Nykyinen oletusäänenvoimakkuus:\`${settings.volume}\``
          );
        }
        try {
          if (newSetting > 2) {
            newSetting = 2;
            message.channel.send(
              "Asetus liian suuri, äänenvoimakkuus rajoitettu 200%"
            );
          }
          await client.updateGuild(message.guild, {
            volume: newSetting,
          });
          message.channel.send("Oletusäänenvoimakkuus päivitetty");
        } catch (e) {
          message.channel.send(`Tapahtui virhe: ${e.message}`);
        }
        break;
      case "removedChannel":
        if (!newSetting) {
          return message.channel.send(
            `Nykyinen oletusäänenvoimakkuus:\`${settings.removedMemberChannel}\``
          );
        }
        try {
          await client.updateGuild(message.guild, {
            removedMemberChannel: newSetting,
          });
          return message.channel.send(`Kanava muutettu: ${newSetting}`);
        } catch (e) {
          return message.channel.send(`Tapahtui virhe: ${e.message}`);
        }
      case "mcdefault":
        if (!newSetting) {
          return message.channel.send(
            `Nykyinen oletustoiminto:\`${settings.mcdefaults.action}\``
          );
        }
        if (newSetting === "status" || newSetting === "query") {
            try {
                await client.updateGuild(message.guild, {
                  "mcdefaults.action": newSetting,
                });
                return message.channel.send(`Oletus muutettu: ${newSetting}`);
              } catch (e) {
                return message.channel.send(`Tapahtui virhe: ${e.message}`);
              }
        } else {
            console.log("kiinni jäi")
        }

        case "mchost":
        if (!newSetting) {
          return message.channel.send(
            `Nykyinen oletusosoite:\`${settings.mcdefaults.host}\``
          );
        }
            try {
                await client.updateGuild(message.guild, {
                  "mcdefaults.host": newSetting,
                });
                return message.channel.send(`Oletus muutettu: ${newSetting}`);
              } catch (e) {
                return message.channel.send(`Tapahtui virhe: ${e.message}`);
              }

      default: {
        const embed = {
          title: "Kaikki botin asetukset",
          description:
            "Voit vaihtaa asetusta antamalla asetuksen nimen ja uuden arvon. Tässä nykyiset arvot",
          fields: [
            {
              name: "Prefix",
              value: `\`${settings.prefix}\``,
              inline: true,
            },
            {
              name: "Oletusäänenvoimakkuus",
              value: `\`${(settings.volume * 100).toFixed(1)} %\``,
              inline: true,
            },
          ],
          author,
        };
        return message.channel.send({ embed });
      }
    }
  },
};
