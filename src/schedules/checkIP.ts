import { IlluminatiJob } from ".";

const job: IlluminatiJob = {
    name: "checkIP",
    schedule: "*/5 * * * *",
    run: (client) => async () => {
        client.checkIP();
    },
};

export default job;
