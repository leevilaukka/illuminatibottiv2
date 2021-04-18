const { MessageEmbed } = require("discord.js");

/**
 * A MessageEmbed with the default fields already filled
 * @constructor
 * @param {User} [user] - The user that executed the command that resulted in this embed
 * @param {object} [data] - Data to set in the rich embed
 */
module.exports = class IlluminatiEmbed extends MessageEmbed {
    constructor(message, data = {}, client) {
        super(data)
        this.setColor(!data.color && 0x00FFFF)
        this.setAuthor("IlluminatiBotti", client?.user.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png")
        if (message.user) this.setFooter(message.user.tag)
    }

    /**
     * 
     * @param {DiscordChannel} channel Discord channel ID
     */
    send(channel) {
        channel.send({embed: this})
    }
}