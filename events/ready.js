const { devServerID } = require("../config");

module.exports = client => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Testing for slash commands
    /* console.log(devServerID)
    client.api.applications(client.user.id).guilds(devServerID).commands.post({
        data: {
            name: "ping",
            description: "PINGPONG SAATANA"
        }
    })
    .then(console.log("Lisättyh"))
    .catch(e => console.error(e))

    client.ws.on('INTERACTION_CREATE', async interaction => {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: "TERETERE"
                }
            }
        });
    }) */
};