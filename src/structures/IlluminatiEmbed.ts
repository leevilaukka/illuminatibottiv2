import { Message, EmbedBuilder, APIEmbed, ActionRowBuilder, AnyComponentBuilder, MessagePayload, MessageCreateOptions, JSONEncodable, APIActionRowComponent, APIMessageActionRowComponent, ActionRowData, MessageActionRowComponentData,  } from "discord.js";
import { IlluminatiClient, Errors } from ".";

import { BaseMessageOptions } from "discord.js/typings/index.js";



/**
 * A 
 * @constructor
 * @extends {MessageEmbed} Discord MessageEmbed class
 * @param {Message} [message] - The message that executed the command that resulted in this embed
 * @param {object} [data] - Data to set in the rich embed
 * @param {IlluminatiClient} client - Discord Bot Client
 */

export default class IlluminatiEmbed extends EmbedBuilder {
    private message: Message;
    private client: IlluminatiClient;
    private rows: ActionRowBuilder[] = [];
    
    constructor(message: Message, client: IlluminatiClient, data?: APIEmbed) {
        super(data);

        !data?.footer && this.setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL()
        });
        
        this.message = message
        this.client = client
    }

    setRows<T extends AnyComponentBuilder>(...rows: ActionRowBuilder<T>[]) {
        this.rows = rows
        return this
    }

    addRows<T extends AnyComponentBuilder>(...rows: ActionRowBuilder<T>[]) {
        this.rows.push(...rows)
        return this
    }

    //#region Send single

    /**
     * Send to channel
     * @method
     * @param {MessageOptions} options MessageOptions to send with the embed
     */
    
    async send(addedOptions?: any) {
        try {
            return await this.message.channel.send({ embeds: [this], components: this.rows, ...addedOptions });
        } catch (err) {
            throw new Errors.BotError(err);
        }
    }

    reply(options?: any) {
        return this.message.reply({...options, embeds: [this], components: this.rows})
    }

    //#endregion

    //#region Send multiple
    
    /**
     * Send many embeds at once
     * @method
     * @param {MessageOptions} options MessageOptions to send with the embed
     * @param {MessageEmbed[] | IlluminatiEmbed[]} embeds Array of MessageEmbed or IlluminatiEmbed objects
     */

    async sendMany(embeds?: (EmbedBuilder | IlluminatiEmbed)[], options?: any) {
        await this.message.channel.send({embeds: [this, ...embeds], ...options})
    }

    async replyMany(embeds: (EmbedBuilder | IlluminatiEmbed)[], options?: any) {
        await this.message.reply({embeds: [this, ...embeds], ...options})
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