const { VoiceConnection, StreamDispatcher, Message } = require("discord.js");
const ytdl = require("ytdl-core");

/**
 * IlluminatiPlayer
 * 
 * Custom VoiceConnection and StreamDispatcher handler for playing Youtube audio
 * @constructor
 * @param {object} options Options to pass to player 
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
        this.message = message

        if (message.member.voice.channel) {
            this.connection = await message.member.voice.channel.join();
            return this
        } else {
            message.reply("et ole puhekanavalla.");
        }
    }

    /**
     * @method
     * @param {URL} url Youtube URL
     * @param {Message} message Discord.js Message
     * @returns IlluminatiPlayer object
     */

    async play(url, message) {
        if (this.connection) {
            if (this.playing) {
                this.queue = [...this.queue, url]
            } else {
                this.dispatcher = this.connection.play(
                    await ytdl(url),
                    this.options
                );               
                this.playing = true;
            }
        } else {
            await this.join(message);
            await this.play(url);
        }
        
        this.dispatcher.on("start", () => {message.channel.send(`Now playing! :notes:`)})
        this.dispatcher.on("finish", async () => {
            this.skip()
        })
        return this
    }

    /**
     * @method
     * Skip currently playing song and play next from queue
     */

    async skip() {
        this.playing = false
        if(this.queue.length > 0) {
            this.message.channel.send("Skipataan..")
            await this.play(this.queue[0], this.message)
            this.queue.shift();
        } else this.stop()
        return this
    }

    /**
     * @method
     * Stop playback and reset player state
     */

    async stop() {
        await this.message.channel.send("Se on loppu ny.")
        await this.reset()
        this.connection && await this.connection.disconnect();
        return this
    }

    async reset() {
        await this.clearQueue();
        this.connection = null
        this.dispatcher = null
        this.playing = false;
        return this;
    }


    /**
     * @method
     * Clear player queue
     */

    async clearQueue() {
        this.queue = []
    }


    /**
     * @method
     * Pause player playback
     */

    pause() {
        this.dispatcher?.pause();
    }

    /**
     * @method
     * Resume player playback
     */

    resume() {
        this.dispatcher?.resume();
    }

    /**
     * @method
     * Set player playback volume
     */

    setVolume(vol) {
        if(isNaN(vol)) return 
        this.dispatcher?.setVolume(vol)
    }
};
