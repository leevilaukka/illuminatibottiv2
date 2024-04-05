import { IlluminatiJob } from "../../schedules";
import { EventType } from "../../types";

const evt: EventType = (client, job: IlluminatiJob) => client.isDevelopment && console.log(`[ranJob] ${job.name} ran!`);

export default evt;
