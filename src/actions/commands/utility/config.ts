import { IlluminatiEmbed } from "../../../structures";

import Command from "../../../types/IlluminatiCommand";

const command: Command= {
  name: "config",
  description: "Tarkastele ja vaihda botin asetuksia palvelimellasi",
  guildOnly: true,
  aliases: ["asetus", "asetukset"],
  permissions: ["MANAGE_GUILD"],
  category: "config",
  async execute(message, args: string[], settings, client) {
    const setting = args[0];
    let newSetting: any = args.slice(1).join(" ");

    switch (setting) {
      // Prefix setting
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
      // Volume setting
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
          return message.channel.send("Oletusäänenvoimakkuus päivitetty");
        } catch (e) {
          return  message.channel.send(`Tapahtui virhe: ${e.message}`);
        }
      // Removed channel setting
      case "removedChannel":
        if (!newSetting) {
          return message.channel.send(
            `Nykyinen kanava:\`${settings.removedMemberChannel}\``
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
      // Minecraft command default action setting
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
        // Minecraft command default host setting
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

      case "randomMessages":
        if (!newSetting) {
            return message.channel.send(
                `Nykyinen asetus:\`${settings.randomMessages}\``
            );
        }
        
        try {
            await client.updateGuild(message.guild, {
              randomMessages: newSetting,
            });
            return message.channel.send(`Oletus muutettu: ${newSetting}`);
        } catch (e) {
            console.error(e)
            return message.channel.send(`Tapahtui virhe: ${e.message}`);
        }
      default: {
        return new IlluminatiEmbed(message, client, {
            title: "Kaikki botin asetukset",
            description: "Voit vaihtaa asetusta antamalla asetuksen nimen ja uuden arvon. Tässä nykyiset arvot",
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
              {
                name: "Satunnaiset viestit",
                value:  `\`${settings.randomMessages ? "Päällä" : "Pois"}\``,
                inline: true,
              },
              {
                name: "Minecraft-servu",
                value: `\`${settings.mcdefaults.host}\``,
              },
            ],
        }).send();
      }
    }
  },
};

export default command;
