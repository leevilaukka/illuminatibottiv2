import { MessageEmbed, TextChannel, DMChannel, Message } from "discord.js"
import { IlluminatiClient, IlluminatiEmbed } from "."

export class PaginatedEmbed {
    message: Message
    client: IlluminatiClient
    embed: MessageEmbed | IlluminatiEmbed
    pages: (MessageEmbed | IlluminatiEmbed)[] = []
    emojis: {
        [key: string]: string
    }

    constructor(message: Message, client: IlluminatiClient, pages: (MessageEmbed | IlluminatiEmbed)[] = [], embed: MessageEmbed | IlluminatiEmbed) {
        this.message = message
        this.client = client
        this.embed = embed
        this.pages = pages

        this.emojis = {
            first: '⏮',
            back: '◀',
            forward: '▶',
            last: '⏭',
            jump: '🔢',
            stop: '⏹'
        }

        pages.forEach(page => this.addPage(page))
    }
    /**
         * Sets emojis, if you don't want the default ones. ¯\_(ツ)_/¯
         * @param {object} [emojis] - Object with emojis to be edited.
         * @returns {PaginatedEmbed}
         */
    setEmojis (emojis: {[key: string]: string}): PaginatedEmbed {
        Object.assign(this.emojis, emojis)
        return this
    }

    addPage(page: MessageEmbed | IlluminatiEmbed): PaginatedEmbed {
        this.pages.push(this._handleGeneration(page))
        return this
    }
    
    private _handleGeneration(page: MessageEmbed | IlluminatiEmbed): MessageEmbed | IlluminatiEmbed {
        throw new Error("Method not implemented.")
    }

    

  
}