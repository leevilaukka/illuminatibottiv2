import { IlluminatiClient } from "../../structures";

export default (client: IlluminatiClient) => {
    console.log(`Logged in as ${client.user?.tag}!`);

    client.checkIP();

    client.jobs.get("digitalocean")?.run(client)(new Date());
};
