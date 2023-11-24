import {
    Message,
    EmbedBuilder,
    APIEmbed,
    ActionRowBuilder,
    AnyComponentBuilder,
    MessagePayload,
    MessageCreateOptions,
    JSONEncodable,
    APIActionRowComponent,
    APIMessageActionRowComponent,
    ActionRowData,
    MessageActionRowComponentData,
    ButtonBuilder,
    ButtonComponent,
    Interaction,
    ChatInputCommandInteraction,
} from "discord.js";
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
    private message: Message | ChatInputCommandInteraction;
    private client: IlluminatiClient;
    private rows: ActionRowBuilder[] = [];
    private pages: IlluminatiEmbed[] = [];
    private MAX_DESCRIPTION_LENGTH = 4096 as const;
    currentPage = 0;

    constructor(message: Message | ChatInputCommandInteraction, client: IlluminatiClient, data?: APIEmbed) {
        super(data);

        this.message = message;
        this.client = client;

        this.parseData();
    }

    parseData() {
        if (!this.data) return;

        if (this.data.description?.length > this.MAX_DESCRIPTION_LENGTH) {
            this.data.description =
                this.data.description.slice(
                    0,
                    this.MAX_DESCRIPTION_LENGTH - 3
                ) + "...";
        }

        if (this.data.title && this.data.title.length > 256) {
            this.data.title = this.data.title.slice(0, 256 - 3) + "...";
        }

        !this.data?.footer &&
            this.setFooter({
                text: `${this.client.user.username}`,
                iconURL: this.client.user.displayAvatarURL(),
            });

        !this.data?.timestamp && this.setTimestamp();

        return this;
    }
    setRows<T extends AnyComponentBuilder>(...rows: ActionRowBuilder<T>[]) {
        this.rows = rows;
        return this;
    }

    addRows<T extends AnyComponentBuilder>(...rows: ActionRowBuilder<T>[]) {
        this.rows.push(...rows);
        return this;
    }

    setPages(embeds: IlluminatiEmbed[]) {
        this.pages = embeds;
        return this;
    }

    addPage(embed: IlluminatiEmbed) {
        this.pages.push(embed);
        return this;
    }

    addPages(embeds: IlluminatiEmbed[]) {
        this.pages.push(...embeds);
        return this;
    }

    pageUp() {
        this.currentPage++;
        if (this.currentPage > this.pages.length - 1) this.currentPage = 0;
        return this;
    }

    pageDown() {
        this.currentPage--;
        if (this.currentPage < 0) this.currentPage = this.pages.length - 1;
        return this;
    }

    pageIndicator() {
        return `${this.currentPage + 1}/${this.pages.length}`;
    }

    async createPagination(addedOptions?: any) {
        this.pages.unshift(this);
        this.rows.push(
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("previous")
                    .setLabel("Edellinen")
                    .setEmoji("⬅️")
                    .setStyle(2),
                new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("Seuraava")
                    .setEmoji("➡️")
                    .setStyle(2)
            )
        );

        const msg = await this.message.channel.send({
            embeds: [this],
            components: this.rows,
            ...addedOptions,
        });

        const collector = msg.createMessageComponentCollector({ time: 120000 });

        collector.on("collect", async (interaction) => {
            switch (interaction.customId) {
                case "previous":
                    this.pageDown();
                    interaction.deferUpdate();
                    break;
                case "next":
                    this.pageUp();
                    interaction.deferUpdate();
                    break;
            }

            await msg.edit({ embeds: [this.pages[this.currentPage]] });
        });

        collector.on("end", () => {
            msg.edit({ components: [] });
        });

        return msg;
    }

    //#region Send single

    /**
     * Send to channel
     * @method
     * @param {MessageOptions} addedOptions MessageOptions to send with the embed
     */

    async send(addedOptions?: any) {
        if (this.pages.length > 0) return this.createPagination(addedOptions);
        try {
            return await this.message.channel.send({
                embeds: [this],
                components: this.rows,
                ...addedOptions,
            });
        } catch (err) {
            throw new Errors.BotError(err);
        }
    }

    async reply(options?: any) {
        if (this.pages.length > 0) return this.createPagination(options);
        return await this.message.reply({
            ...options,
            embeds: [this],
            components: this.rows,
        });
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
        await this.message.channel.send({
            embeds: [this, ...embeds],
            ...options,
        });
    }

    async replyMany(embeds: (EmbedBuilder | IlluminatiEmbed)[], options?: any) {
        await this.message.reply({ embeds: [this, ...embeds], ...options });
    }

    //#endregion

    /**
     * Save the embed to the database
     * @unstable
     * TODO: Fix this
     */

    async save() {
        new this.client
            .guildManager(this.message.guild)
            .pushToArray("embeds", this);
    }
}
