import { MessageEmbed, Message, MessageEmbedOptions } from "discord.js";
import IlluminatiClient from "./IlluminatiClient";

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
    constructor(message: Message, data: MessageEmbedOptions, client: IlluminatiClient) {
        super(data)
        this.message = message
        this.setColor(data.color || 0x229924)
        this.setAuthor(client?.user?.username, client?.user?.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png")
        if (message.member) this.setFooter(message.member.user.tag, `https://cdn.discordapp.com/avatars/${message.member.id}/${message.member.user.avatar}.png`)
    }

    /**
     * Send to channel
     * @method
     * @param {string} text Text to send with embed
     */
    
    async send(text?: string) {
        await this.message.channel.send(text, {embed: this})
    }
}