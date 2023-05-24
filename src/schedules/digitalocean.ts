import { IlluminatiJob } from ".";
import DigitalOcean from "do-wrapper";

const job: IlluminatiJob = {
    name: "digitalocean",
    schedule: "*/30 * * * *",
    run: (client) => async () => {
        const ip = client.ip;

        if (!ip) {
            return;
        }

        if (!client.isProduction) {
            return;
        }

        const digitalOcean = new DigitalOcean(process.env.DO_TOKEN);

        digitalOcean.domains.updateRecord("leevila.fi", "1684829917", {
            data: ip,
            name: "server",
            ttl: 3000,
            type: "A",
            tag: "",
        });
    },
};

export default job;
