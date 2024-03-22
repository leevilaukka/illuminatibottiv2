import schedule, { JobCallback, RecurrenceRule } from 'node-schedule';
import fs from 'fs';
import { ErrorWithStack } from '../structures/Errors';
import { IlluminatiClient } from '../structures';

type ScheludeType = RecurrenceRule | string | number;

const jobs = fs.readdirSync(__dirname).filter((file) => file !== 'index.js' && !file.endsWith('.map.js') && file.endsWith('.js'));

export interface IlluminatiJob {
    name: string;
    schedule: ScheludeType
    devOnly?: boolean;
    run: (client: IlluminatiClient) => JobCallback;
    onInit?: (client: IlluminatiClient) => void;
}

const importSchedules = async (client: IlluminatiClient) => {
    try {
        for await (const job of jobs) {
            const jobFileName = `${__dirname}/${job}`
            
            import(jobFileName).then(({ default: job }: {default: IlluminatiJob}) => {
                if (job.devOnly && process.env.NODE_ENV !== 'development') return;
                if (!job.schedule) throw new Error(`Schedule not defined for ${job.name} at ${jobFileName}`)
                if (typeof job.run !== "function") throw new Error(`Run function not defined for ${job.name} at ${jobFileName}`)

                schedule.scheduleJob(job.schedule, job.run(client))
                client.jobs.set(job.name, job);
                console.log(`Loaded schedule: ${job.name}`)

                job.onInit?.(client);
            });
        }
    } catch (error) {
        throw new ErrorWithStack(error);
    }
};

const updateJob = async (job: schedule.Job, newSchedule: ScheludeType) => {
    try {
        job.reschedule(newSchedule);
    } catch (error) {
        throw new ErrorWithStack(error);
    }
};

export default { importSchedules, updateJob };