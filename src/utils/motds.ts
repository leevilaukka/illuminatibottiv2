import { ActivityOptions, ActivityType, User } from "discord.js";
import { IlluminatiClient } from "../structures";

export default (client: IlluminatiClient) =>
    [
        {
            name: "Written in TypeScript!",
            type: ActivityType.Custom,
        },
        {
            name: "Aamuja :DD",
            type: ActivityType.Custom,
        },
        {
            name: "Isoveli valvoo 🔺",
            type: ActivityType.Custom,
        },
        {
            name: "Soon™️",
            type: ActivityType.Custom,
        },
        {
            name: "Mähän sanoin etten vedä vittu enää kertaakaa!",
            type: ActivityType.Custom,
        },
        {
            name: "ASENTO!",
            type: ActivityType.Custom,
        },
        {
            name: "Since 2020",
            type: ActivityType.Custom,
        },
        {
            name: `${IlluminatiClient.Commands.length} commands!!`,
            type: ActivityType.Custom,
        },
        {
            name: "Juu että sillä lailla..",
            type: ActivityType.Custom
        },
        {
            name: `@${client.owner.then(user => user.displayName)}:n TJ on tänään ${Math.round((new Date("09/18/2024").getTime() - new Date().getTime()) / (1000 * 3600 * 24))} :DDD`,
            type: ActivityType.Custom
        }
    ] as ActivityOptions[];
