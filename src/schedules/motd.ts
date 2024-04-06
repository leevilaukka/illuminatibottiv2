import { IlluminatiJob } from ".";
import { randomArray } from "../structures/IlluminatiHelpers";
import motds from "../utils/motds";

const job: IlluminatiJob = {
    name: "motd",
    schedule: process.env.MOTD_CRON || "*/1 * * * *",
    run: (client) => async () => {
        const randomMotd = randomArray(motds(client));
        client.user.setActivity(randomMotd);
    },
};

export default job;
