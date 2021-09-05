import { MessageEmbed, Message, MessageEmbedOptions } from "discord.js";
import { IlluminatiClient } from ".";

/**
 * A MessageEmbed with the default fields already filled
 * @constructor
 * @extends {MessageEmbed} Discord MessageEmbed class
 * @param {Message} [message] - The user that executed the command that resulted in this embed
 * @param {object} [data] - Data to set in the rich embed
 * @param {IlluminatiClient} client Discord Bot Client
 */

export default class IlluminatiEmbed extends MessageEmbed {
    message: Message;
    constructor(message: Message, client: IlluminatiClient, data: MessageEmbedOptions) {
        super(data)
        this.message = message
        this.timestamp = new Date().getTime();
        this.setColor(data.color || message.guild.me.displayHexColor)
        this.setAuthor(client?.user?.username, client?.user?.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png")
        if (message.member) this.setFooter(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic : true }))
    }

    /**
     * Send to channel
     * @method
     * @param {string} text Text to send with embed
     */
    
    async send(content?: string) {
        return this.message.channel.send({content, embeds: [this]})
    }

    async reply(content?: string) {
        return this.message.reply({content, embeds: [this]})
    }

    /**
     * Send many embeds at once
     * @method
     * @param {string} content Content to send with embed
     * @param {MessageEmbed[] | IlluminatiEmbed[]} embeds Array of MessageEmbed or IlluminatiEmbed objects
     */

    async sendMany(embeds?: (MessageEmbed | IlluminatiEmbed)[], content?: string) {
        await this.message.channel.send({content, embeds: [this, ...embeds]})
    }

    async replyMany(embeds?: (MessageEmbed | IlluminatiEmbed)[], content?: string) {
        await this.message.reply({content, embeds: [this, ...embeds]})
    }
}