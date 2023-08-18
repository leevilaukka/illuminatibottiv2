import { IlluminatiJob } from ".";

const job: IlluminatiJob = {
    name: "checkIP",
    schedule: "*/15 * * * *",
    run: (client) => async () => {
        client.updateIP();
    },
};

export default job;
