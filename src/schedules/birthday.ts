import { IlluminatiJob } from ".";
import { User } from "../models";

const job: IlluminatiJob = {
    name: "birthday",
    schedule: "0 12 * * *",
    run: (client) => async () => {
        const users = await User.find({birthday: {$ne: null}});

        users.forEach(user => {
            if (user.isBirthday()) {
                user.getDiscordUser(client).then(user => {
                    user.send("Happy birthday!");
                })
            }
        })
    }
}

export default job;