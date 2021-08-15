import { gql, request } from "graphql-request";

import { formatDate, valueParser } from "../../../helpers";
import { IlluminatiEmbed } from "../../../structures";
import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "reitti",
    description: "Hae reittejä tallennetuilla koordinaateilla",
    category: "maps",
    cooldown: 5,
    aliases: ["hsl"],
    args: true,
    async execute(message, args, settings, client) {
        const [origin, destination] = args;
        const guild = await client.getGuild(message.guild);
        const places = guild.places;
        console.log(guild);
        const originResult = places.find(({ name }) => name === origin);
        const destResult = places.find(({ name }) => name === destination);

        console.log(originResult);
        console.log(destResult);

        const query = gql`
              {
                  plan(
                      from: {lat: ${originResult.coords.lat},lon: ${originResult.coords.lon}}
                      to: {lat: ${destResult.coords.lat}, lon: ${destResult.coords.lon}}
                  ) {
                      itineraries {
                          legs {
                              startTime
                              endTime
                              mode
                              duration
                              realTime
                              distance
                              transitLeg
                              trip {
                                  tripHeadsign
                                  routeShortName
                              }
                              to {
                                  name
                              }
                              from {
                                  name
                              }
                          }
                      }
                  }
              }
          `;
        request(
            "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
            query
        ).then((data) => {
            client.isDevelopment && console.log(data.plan.itineraries[0]);
            const route = data.plan.itineraries[0];
            message.channel.send("Reittisi!");
            route.legs.map((leg, index) => {
                const startTime = new Date(leg.startTime);
                const endTime = new Date(leg.endTime);
                const embed = new IlluminatiEmbed(message, {
                    title: `Vaihe ${index + 1}`,
                    fields: [
                        {
                            name: "Lähtöaika",
                            value: `${formatDate(startTime.getTime() / 1000)}`,
                            inline: true,
                        },
                        {
                            name: "Saapumisaika",
                            value: `${formatDate(endTime.getTime() / 1000)}`,
                            inline: true,
                        },
                        {
                            name: "Matka",
                            value: `${Math.ceil(leg.distance)} m`,
                            inline: true,
                        },
                        {
                            name: "Kesto",
                            value: `${Math.ceil(leg.duration / 60)} min`,
                            inline: true,
                        },
                        {
                            name: "Reitti",
                            value: `${leg.from.name} :arrow_right: ${leg.to.name}`,
                        },
                        {
                            name: "Kulkuneuvo",
                            value: valueParser(leg.mode),
                            inline: true,
                        },
                    ],
                }, client);
                if (leg.trip) {
                    embed.fields.push({
                        name: "Trip",
                        value: `${leg.trip.tripHeadsign} / ${leg.trip.routeShortName}`,
                        inline: true,
                    });
                }
                message.channel.send({ embeds: [embed] });
            });
        });
    },
};

export default command