const { VoiceConnection, StreamDispatcher, Message } = require("discord.js");
const ytdl = require("ytdl-core");

/**
 * Custom VoiceConnection and StreamDispatcher handler for playing Youtube audio
 * @constructor
 * @param {object} options Options to pass to YTDL 
 */

module.exports = class IlluminatiPlayer {
    constructor(options) {
        this.options = options;
        this.connection = VoiceConnection;
        this.dispatcher = StreamDispatcher;
        this.queue = [];
        this.playing = false;
        this.message = null;
    }


    /**
     * @method
     * @param {Message} message Discord.js Message 
     * @returns connection
     */

    async join(message) {
        if (message.member.voice.channel) {
            this.connection = await message.member.voice.channel.join();
            return this.connection;
        } else {
            this.message.reply("et ole puhekanavalla.");
        }
    }

    /**
     * @method
     * @param {URL} url Youtube URL
     * @param {Message} message Discord.js Message
     * @returns dispatcher
     */

    async play(url, message) {
        this.message = message

        if (this.connection) {
            if (this.playing) {
                this.queue = [...this.queue, url]
            } else {
                this.dispatcher = this.connection.play(
                    await ytdl(url, this.options)
                );               
                this.playing = true;
                return this.dispatcher;
            }
        } else {
            await this.join(message);
            await this.play(url);
        }
        console.log(this);
        this.dispatcher.on("start", () => {console.log("MOI");})
        this.dispatcher.on("finish", async () => {
            this.skip()
        })
    }

    async skip() {
        this.playing = false
        if(this.queue.length > 0) {
            console.log("test")
            await this.play(this.queue[0], this.message)
            this.queue.shift();
        } else this.stop()
    }

    stop() {
        this.connection && this.connection.disconnect();
        this.connection = null
        this.dispatcher = null
        this.playing = false;
        this.queue = []
    }

    clearQueue() {
        this.queue = []
    }

    pause() {
        this.dispatcher?.pause();
    }

    resume() {
        this.dispatcher?.resume();
    }
};
