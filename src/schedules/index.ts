import schedule, { JobCallback, RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from 'node-schedule';
import fs from 'fs';
import { ErrorWithStack } from '../structures/Errors';
import { IlluminatiClient } from '../structures';

const jobs = fs.readdirSync(__dirname).filter((file) => file !== 'index.js' && !file.endsWith('.map.js') && file.endsWith('.js'));

export interface IlluminatiJob {
    name: string;
    schedule: RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | string | number;
    devOnly?: boolean;
    run: (client: IlluminatiClient) => JobCallback;

    onInit?: (client: IlluminatiClient) => void;
}

console.log(jobs)
const importSchedules = async (client: IlluminatiClient) => {
    try {
        for await (const job of jobs) {
            import(`${__dirname}/${job}`).then(({ default: job }: {default: IlluminatiJob}) => {
                console.log(`Loaded schedule: ${job.name}`)
                if (job.devOnly && process.env.NODE_ENV !== 'development') return;
                schedule.scheduleJob(job.schedule, job.run(client))
                client.jobs.set(job.name, job);
            });
        }
    } catch (error) {
        throw new ErrorWithStack(error);
    }
};

const updateJob = async (job: schedule.Job, newSchedule: RecurrenceRule | string | number) => {
    try {
        job.reschedule(newSchedule);
    } catch (error) {
        throw new ErrorWithStack(error);
    }
};

export default {importSchedules, updateJob};