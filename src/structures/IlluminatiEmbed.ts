import { Message, Embed, EmbedBuilder, APIEmbed, RestOrArray, APIEmbedField } from "discord.js";
import { IlluminatiClient, Errors } from ".";

/**
 * A MessageEmbed with the default fields already filled
 * @constructor
 * @extends {MessageEmbed} Discord MessageEmbed class
 * @param {Message} [message] - The message that executed the command that resulted in this embed
 * @param {object} [data] - Data to set in the rich embed
 * @param {IlluminatiClient} client - Discord Bot Client
 */

export default class IlluminatiEmbed extends EmbedBuilder {
    private message: Message;
    private client: IlluminatiClient;
    private embed: EmbedBuilder;
    
    constructor(message: Message, client: IlluminatiClient, data?: APIEmbed) {
        super(data);
        
        this.message = message
        this.client = client
        this.embed = new EmbedBuilder(data)
    }

    get embedObject() {
        return this.embed
    }


    //#region Send single

    /**
     * Send to channel
     * @method
     * @param {MessageOptions} options MessageOptions to send with the embed
     */
    
    async send(options?: any) {
        try {
            return await this.message.channel.send({ ...options, embeds: [this.embed] });
        } catch (err) {
            throw new Errors.BotError(err);
        }
    }

    reply(options?: any) {
        return this.message.reply({...options, embeds: [this.embed]})
    }

    //#endregion

    //#region Send multiple
    
    /**
     * Send many embeds at once
     * @method
     * @param {MessageOptions} options MessageOptions to send with the embed
     * @param {MessageEmbed[] | IlluminatiEmbed[]} embeds Array of MessageEmbed or IlluminatiEmbed objects
     */

    async sendMany(embeds?: (EmbedBuilder |IlluminatiEmbed)[], options?: any) {
        await this.message.channel.send({embeds: [this.embed, ...embeds], ...options})
    }

    async replyMany(embeds: (EmbedBuilder | IlluminatiEmbed)[], options?: any) {
        await this.message.reply({embeds: [this.embed, ...embeds], ...options})
    }

    //#endregion

     /**
     * Save the embed to the database
     * @unstable
     * TODO: Fix this
     */

    async save() {
        this.client.guildManager(this.message.guild).pushToArray("embeds", [this])
    }
}