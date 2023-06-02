import { IlluminatiJob } from ".";
import DigitalOcean from "do-wrapper";

const job: IlluminatiJob = {
    name: "digitalocean",
    schedule: "5 * * * *",
    run: (client) => async () => {
        const ip = client.hostIP;
        if (!ip) {
            return;
        }
        const digitalOcean = new DigitalOcean(process.env.DO_TOKEN);

        const subdomains = [
            { name: "server", id: "1684932521" },
            { name: "mineservu", id: "268566946" },
        ];

        const updates = subdomains.map(async (subdomain) => {
            console.log("Updating " + subdomain.name + ".leevila.fi to " + ip);
            digitalOcean.domains.updateRecord("leevila.fi", subdomain.id, {
                data: ip,
                name: subdomain.name,
                ttl: 3000,
                type: "A",
                tag: "",
            });
        });

        await Promise.all(updates)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                client.logger.error(err);
            });
        client.logger.info("Updated DigitalOcean DNS records");
    },
};

export default job;
