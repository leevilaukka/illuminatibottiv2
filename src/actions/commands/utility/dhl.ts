import { time } from "discord.js";
import { IlluminatiEmbed } from "../../../structures";
import { Categories } from "../../../types/IlluminatiCommand";
import Package from "../../../models/Package";
import { Command, DHLResponse } from "../../../types";

const command: Command = {
    name: "dhl",
    description: "Get DHL tracking info",
    category: Categories.other,

    run: async (message, args, settings, client) => {
        const baseURL = "https://api-eu.dhl.com/track/shipments";

        client.axios
            .get<DHLResponse>(baseURL, {
                headers: {
                    "DHL-API-Key": process.env.DHL_API_KEY,
                },
                params: {
                    trackingNumber: args[0],
                },
            })
            .then(async (res) => {
                console.log(res.data);
                const data = res.data.shipments[0];

                console.log(data);

                const lastEventTime = new Date(data.events[0].timestamp);

                const sent = await new IlluminatiEmbed(message, client, {
                    title: "DHL Tracking",
                    fields: [
                        {
                            name: "Tracking Number / ID",
                            value: data.id,
                            inline: true,
                        },
                        {
                            name: "Service",
                            value: data.service,
                            inline: true,
                        },
                        {
                            name: "Product",
                            value: data.details.product.productName,
                        },
                        {
                            name: "Origin",
                            value: `${data.origin.address.addressLocality}, ${data.origin.address.postalCode}, ${data.origin.address.countryCode}`,
                            inline: true,
                        },
                        {
                            name: "Destination",
                            value: `${data.destination.address.addressLocality}, ${data.destination.address.postalCode}, ${data.destination.address.countryCode}`,
                            inline: true,
                        },
                        {
                            name: "Status",
                            value: `${data.status.status} (${data.status.statusCode})`,
                        },
                        {
                            name: "Last Event Time",
                            value: `${time(lastEventTime)}`,
                        },
                    ],
                }).send();

                if (args[1] === "save") {
                    Package.create({
                        code: data.id,
                        owner: message.author.id,
                        lastUpdated: lastEventTime,
                    })
                        .then(() => {
                            sent.reply("Package saved!");
                        })
                        .catch((err) => {
                            sent.reply(
                                "An error occured while saving the package!"
                            );
                        });
                }
            });
    },
};

export default command;
