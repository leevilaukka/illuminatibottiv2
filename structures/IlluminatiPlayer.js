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
    constructor(client, options) {
        this.client = client
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

        const guildOpts = await this.client.getGuild(message.guild)

        let opts = {...this.options, volume: guildOpts.volume }

        if (this.connection) {
            if (this.playing) {
                this.queue = [...this.queue, url]
            } else {
                this.dispatcher = this.connection.play(
                    await ytdl(url),
                    opts
                );               
                this.playing = true;
                return this.dispatcher;
            }
        } else {
            await this.join(message);
            await this.play(url);
        }
        
        this.dispatcher.on("start", () => {message.channel.send(`Now playing! :notes:`)})
        this.dispatcher.on("finish", async () => {
            this.skip()
        })
    }

    /**
     * @method
     * Skip currently playing song and play next from queue
     */

    async skip() {
        this.message.channel.send("Skipataan..")
        this.playing = false
        if(this.queue.length > 0) {
            await this.play(this.queue[0], this.message)
            this.queue.shift();
        } else this.stop()
    }

    /**
     * @method
     * Stop playback and reset player state
     */
    stop() {
        this.message.channel.send("Se on loppu ny.")
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

    setVolume(vol) {
        if(isNaN(vol)) return 
        this.dispatcher?.setVolume(vol)
    }
};
