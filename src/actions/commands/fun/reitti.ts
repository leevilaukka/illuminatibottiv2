import { gql, request } from "graphql-request";

import { formatDate, valueParser } from "../../../helpers";
import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
type RequestResultData = {
    plan: {
        itineraries: Itinerany[];
    };
};

type Itinerany = {
    startTime: number;
    endTime: number;
    duration: number;
    legs: Leg[];
    waitingTime: number;
    walkTime: number;
    walkDistance: number;
    fares: {
        type: string;
        currency: string;
        cents: number;
        components: any;
    }[];
    elevationGained: number;
    elevationLost: number;
};

type Leg = {
    startTime: number;
    endTime: number;
    distance: number;
    departureDelay: number;
    legGeometry: {
        length: number;
        points: string;
    };
    duration: number;
    from: { name: string };
    to: { name: string };
    mode: string;
    trip: { tripHeadsign: string; routeShortName: string };
};

const command: Command = {
    name: "reitti",
    description: "Hae reittejä tallennetuilla koordinaateilla",
    category: Categories.maps,
    cooldown: 5,
    aliases: ["hsl"],
    args: true,
    outOfOrder: true,
    async run(message, args, settings, client, { guild }) {
        const [origin, destination] = args;

        const places = (await guild.getGuild()).places;
        const originResult = places.find(({ name }) => name === origin);
        const destResult = places.find(({ name }) => name === destination);

        const query = gql`
              {
                  plan(
                      from: {lat: ${originResult.location.coordinates[1]},lon: ${originResult.location.coordinates[0]}},
                      to: {lat: ${destResult.location.coordinates[1]}, lon: ${destResult.location.coordinates[0]}},
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
        ).then((data: RequestResultData) => {
            const route = data.plan.itineraries[0];
            message.channel.send("Reittisi!");

            const mainEmbed = new IlluminatiEmbed(message, client, {
                title: "Reittisi",
                description: "Katso vaiheet vaihtamalla sivua",
            });

            route.legs.map((leg, index) => {
                const startTime = new Date(leg.startTime);
                const endTime = new Date(leg.endTime);
                const embed = new IlluminatiEmbed(message, client, {
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
                });
                if (leg.trip) {
                    embed.setFields([
                        {
                            name: "Trip",
                            value: `${leg.trip.tripHeadsign} / ${leg.trip.routeShortName}`,
                            inline: true,
                        },
                    ]);
                }
                mainEmbed.addPage(embed);
            });

            mainEmbed.send();
        });
    },
};

export default command;
