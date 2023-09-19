import { UserError } from "../../../structures/Errors";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: 'daily',
    outOfOrder: true,
    category: Categories.economy,
    async run(message, args, settings, client, { user }) {
        if(user.checkDailyStreak()){
            user.addMoney(100)
            message.channel.send(`You have received 100 coins for your daily streak.`)
        } else {
            throw new UserError(`You have already received your daily reward.`)
        }
    }
}
export default command