import Alcometer from "../../../models/Alcometer";
import { Command } from "../../../types";

import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ChartConfiguration, TimeSeriesScale } from "chart.js";
import { User } from "discord.js";
import { time } from "console";

const command: Command = {
    name: "graph",
    aliases: ["g"],
    description: "Get a graph of your BAC",
    category: "other",
    async run(message, args, settings, client, { user, guild }) {
        const alcometers = await Alcometer.find({});

        const data = alcometers.map((alcometer) => {
            const user = client.users.cache.get(alcometer.user) as User;

            return {
                label: user.username,
                data: alcometer.bacHistory.map((bac) => bac.bac),
                fill: false,
                borderColor: alcometer.info.lineColor,
                tension: 0.1,
            };
        });

        const config: ChartConfiguration = {
            type: "line",
            data: {
                datasets: data,
                labels: alcometers[0].bacHistory.map((bac) =>
                    bac.time.getTime()
                ),
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        };

        const width = 800;
        const height = 600;

        const canvas = new ChartJSNodeCanvas({
            width,
            height,
        });

        const image = await canvas.renderToBuffer(config);

        return message.channel.send({
            files: [
                {
                    attachment: image,
                    name: "graph.png",
                },
            ],
        });
    },
};

export default command;
