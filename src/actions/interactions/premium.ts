import { ContextMenuInteraction } from "discord.js"
import { IlluminatiInteraction } from "../../types/IlluminatiInteraction"

const interaction: IlluminatiInteraction = {
    data: {
        name: 'Anna Premium',
        type: 2,
        defaultPermission: false,
    },
    permissions: {
        id: process.env.OWNER_ID,
        type: "USER",
        permission: true
    },
    async execute(data: ContextMenuInteraction, client) {
        const user = await client.users.fetch(data.targetId)
        if(user.bot) return data.reply({content: "Et voi antaa premiumia botille!", ephemeral: true})
        try{
            client.userManager(user).givePremium()
        } catch(e){
           return console.log(e)
        }

        return data.reply({content: `Premium annettu käyttäjälle ${user.username}`, ephemeral: true})
    }
}

export default interaction