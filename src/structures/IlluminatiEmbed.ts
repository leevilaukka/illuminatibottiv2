import { MessageEmbed, Message, MessageEmbedOptions, MessageOptions } from "discord.js";
import { IlluminatiClient } from ".";

/**
 * A MessageEmbed with the default fields already filled
 * @constructor
 * @extends {MessageEmbed} Discord MessageEmbed class
 * @param {Message} [message] - The message that executed the command that resulted in this embed
 * @param {object} [data] - Data to set in the rich embed
 * @param {IlluminatiClient} client Discord Bot Client
 */

export default class IlluminatiEmbed extends MessageEmbed {
    private message: Message;
    
    constructor(message: Message, client: IlluminatiClient, data: MessageEmbedOptions) {
        super(data)
        this.message = message
        this.timestamp = new Date().getTime();
        this.setColor(data.color || message.guild.me.displayHexColor || "#7289DA")
        this.setAuthor(client?.user?.username, client?.user?.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png")
        if (message.member && !data.footer) this.setFooter(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic : true }))
    }

    /**
     * Send to channel
     * @method
     * @param {MessageOptions} options MessageOptions to send with the embed
     */
    
    async send(options?: MessageOptions) {
        return this.message.channel.send({...options, embeds: [this]})
    }

    async reply(options?: MessageOptions) {
        return this.message.reply({...options, embeds: [this]})
    }

    /**
     * Send many embeds at once
     * @method
     * @param {MessageOptions} options MessageOptions to send with the embed
     * @param {MessageEmbed[] | IlluminatiEmbed[]} embeds Array of MessageEmbed or IlluminatiEmbed objects
     */

    async sendMany(embeds?: (MessageEmbed | IlluminatiEmbed)[], options?: MessageOptions) {
        await this.message.channel.send({...options, embeds: [this, ...embeds]})
    }

    async replyMany(embeds: (MessageEmbed | IlluminatiEmbed)[], options?: MessageOptions) {
        await this.message.reply({embeds: [this, ...embeds], ...options})
    }
}