import { User } from "discord.js";
import { IlluminatiJob } from ".";
import Alcometer from "../models/Alcometer";
import UserFunctions from "../structures/IlluminatiUser";

const job: IlluminatiJob = {
    name: "alcometer",
    schedule: "*/5 * * * *",
    run: (client) => async () => {
        // Update BAC for all users with an alcometer every 5 minutes
        const alcometers = await Alcometer.find().populate("user");
        alcometers.forEach(async (alcometer) => {
            const meterFunctions = await UserFunctions(
                await client.users.fetch(alcometer.user)
            ).alcometer();

            if (alcometer.bac <= 0) return await meterFunctions.clearHistory();
            meterFunctions.decrementBAC();
        });
    },
};

export default job;
