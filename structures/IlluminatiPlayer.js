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
            return this.connection;
        } else {
            message.reply("et ole puhekanavalla.");
        }
    }

    /**
     * @method
     * @param {URL} url Youtube URL
     * @param {Message} message Discord.js Message
     * @returns dispatcher
     */

    async play(url, message) {
        if (this.connection) {
            const {videoDetails} = await ytdl.getInfo(url)
            
            console.log(videoDetails)
            if (this.playing) {
                this.queue = [...this.queue, {
                    url,
                    info: videoDetails
                }]
                this.message.channel.send(`Lisätty jonoon: ${videoDetails.title}`)
            } else {
                this.dispatcher = this.connection.play(
                    await ytdl(url),
                    this.options
                );      
                this.playing = true;

                const embed = {
                    title: `:notes: Nyt toistetaan: ${videoDetails.title}`,
                    url: videoDetails.video_url,
                    fields: [
                        {
                            name: "Kanava",
                            value: videoDetails.ownerChannelName,
                            inline: true
                        },
                        {
                            name: "Julkaisupvm.",
                            value: videoDetails.publishDate,
                            inline: true
                        },
                        {
                            name: "Näyttökerrat",
                            value: videoDetails.viewCount
                        },
                        {
                            name: "Kesto sekunteina",
                            value: videoDetails.lengthSeconds,
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: videoDetails.thumbnails[0].url
                    }
                }
                this.message.channel.send({embed})
                return this.dispatcher;
            }
        } else {
            await this.join(message);
            await this.play(url);
        }
        
        this.dispatcher.on("finish", async () => {
            this.skip()
        })
    }

    async sendQueue(message) {
        if(!this.queue) return message.reply(", jono on tyhjä. Pistä bileet pystyyn!");
        let fields = [];
        this.queue.forEach((song, i) => {
            fields.push({
                name: i + 1,
                value: `${song.info.title} - ${videoDetails.ownerChannelName}`
            })
        })

        const embed = {
            title: "Jono :notes:",
            fields
        }

        message.channel.send({embed})
    }

    /**
     * @method
     * Skip currently playing song and play next from queue
     */

    async skip() {
        this.playing = false
        console.log(this.queue)
        if(this.queue.length > 0) {
            this.message.channel.send("Skipataan..")
            await this.play(this.queue[0].url, this.message)
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
