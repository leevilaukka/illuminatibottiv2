import { IlluminatiJob } from ".";
import { User } from "../models";

const job: IlluminatiJob = {
    name: "birthday",
    schedule: "0 12 * * *",
    run: (client) => async () => {
        const users = await User.find({birthday: {$ne: null}});

        users.forEach(user => {
            if (user.stats.birthday.getDate() === new Date().getDate() && user.stats.birthday.getMonth() === new Date().getMonth()) {
                client.users.fetch(user.discordID).then(dUser => {
                    dUser.send(`Hyvää syntymäpäivää, ${dUser.username}!`);
                })
            }
        }
        )
    }
}

export default job;