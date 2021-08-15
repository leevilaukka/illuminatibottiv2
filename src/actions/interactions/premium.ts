import { ContextMenuInteraction } from "discord.js"
import { IlluminatiClient } from "../../structures"

const interaction = {
    data: {
        name: 'premium',
        type: 2
    },
    async execute(data: ContextMenuInteraction, client: IlluminatiClient) {
        console.log("premium", data)
        const user = await client.users.fetch(data.targetId)
        if(user.bot) return data.reply({content: "Et voi antaa premiumia botille!", ephemeral: true})
        try{
            client.userManager.givePremium(user)
        } catch(e){
           return console.log(e)
        }

        return data.reply({content: "Premium annettu", ephemeral: true})
    }
}

export default interaction