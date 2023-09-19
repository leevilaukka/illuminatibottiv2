import { IlluminatiJob } from ".";
import DigitalOcean from "do-wrapper";
import IP from "../models/Ip";

const job: IlluminatiJob = {
    name: "digitalocean",
    schedule: "5 * * * *",
    run: (client) => async () => {
        const ip = client.ip
        if (!ip) {
            return;
        }

        if (!process.env.DO_TOKEN) {
            client.logger.error("No DigitalOcean token given!");
            return;
        }

        if (!client.isProduction) {
            return;
        }

        const digitalOcean = new DigitalOcean(process.env.DO_TOKEN);

        const { domains } = client.domainData;

        const updates = domains.map(async (subdomain) => {
            return digitalOcean.domains.updateRecord(
                "leevila.fi",
                subdomain.id,
                {
                    data: ip,
                    name: subdomain.name,
                    ttl: 3000,
                    type: "A",
                    tag: "",
                }
            );
        });

        await Promise.allSettled(updates)
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
