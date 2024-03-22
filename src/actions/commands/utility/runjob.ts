import { codeBlock } from "discord.js";
import { Command } from "../../../types";

const command: Command<1> = {
    name: "runjob",
    aliases: ["rj"],
    ownerOnly: true,
    description: "Run a job",
    category: "utility",
    async run(message, args, settings, client, { guild }) {
        const [jobName] = args;

        const job = client.jobs.get(jobName);

        if (!job) return message.channel.send("Job not found");

        const runner = job.run(client)
        const res = await runner(new Date());

        message.channel.send(`Job ${jobName} ran with result\n${codeBlock(res)}`);
    },
};

export default command;