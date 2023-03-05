import { IlluminatiJob } from ".";
import { DHLResponse } from "../actions/commands/utility/dhl";
import Package from "../models/Package";

const job: IlluminatiJob = {
    name: "packages",
    schedule: "*/15 * * * *",
    run: (client) => async () => {
        console.info("Checking packages...");
        const packages = await Package.find({});

        for (const pkg of packages) {
            await client.axios.get<DHLResponse>(`https://api-eu.dhl.com/track/shipments?trackingNumber=${pkg.code}`, {
                headers: {
                    "DHL-API-Key": process.env.DHL_API_KEY
                }
            }).then(async (response) => {
                const shipment = response.data.shipments[0];

                const shippingLastStatusTime = new Date(shipment.status.timestamp);
    
                if(shippingLastStatusTime.getTime() > pkg.lastUpdated.getTime()) {
                    const owner = await client.users.fetch(pkg.owner);
    
                    owner.send(`Your package ${pkg.code} has been updated to ${shipment.status.status}!`);
                }
            }).catch((err) => {
                console.log(err);
            });            
        }
    }
}

export default job;

