const { default: axios } = require("axios");
const { VoiceConnection, StreamDispatcher, Message } = require("discord.js");
const moment = require("moment");
const ytdl = require("ytdl-core");
const { umlautRemover } = require("../helpers");
const IlluminatiEmbed = require("./IlluminatiEmbed");

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
     * @returns {VoiceConnection} connection
     */

    async join(message) {

        if (message.member.voice.channel) {
            this.connection = await message.member.voice.channel.join();
            return this.connection;
        } else {
            message.reply("et ole puhekanavalla.");
        }
        return this
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
            const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(url)
            if (!regex) url = await this.searchVideo(url)

            const {videoDetails} = await ytdl.getInfo(url)
            
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

                let seconds = videoDetails.lengthSeconds % 60;
                
                if (seconds < 10) {
                    seconds = `0${seconds}`
                }

                const views = videoDetails.viewCount.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
           
                new IlluminatiEmbed(message, {
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
                            value: moment(videoDetails.publishDate, "YYYY-MM-DD").format("DD.MM.YYYY"),
                            inline: true
                        },
                        {
                            name: "Näyttökerrat",
                            value: views,
                            inline: true
                        },
                        {
                            name: "Kesto",
                            value: `${Math.floor(videoDetails.lengthSeconds / 60)}:${seconds}`,
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: videoDetails.thumbnails[0].url
                    }
                }, this.client).send()

                return this;
            }
        } else {
            await this.join(message);
            await this.play(url, message);
        }
        
        this.dispatcher.on("finish", async () => {
            await this.skip(message)
        })
    }

    /**
     * Play from file
     * @param {FilePath} file 
     * @param {Message} message 
     */

    async playFile(file, message) {
        if(this.connection) {
            this.connection.play(file)
        }
        else {
            this.join(message)
            this.playFile(file, message)
        }
    }
    
    /**
     * @method
     * @param {string} search Search query
     * @returns first search result from YouTube list
     */
    
    async searchVideo(search) {
        const token = process.env.GOOGLE_API;

        return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${umlautRemover(search)}&key=${token}&type=video&topicId=/m/04rlf`)
        .then(res => {
            return `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`
        })
        .catch(() => {
            return search
        })
    }

    /**
     * 
     * @param {number} index Song position in queue
     * @param {Message} message Discord.js Message object
     * @returns IlluminatiPlayer object
     */

    async queueDelete(index, message) {
        if(!this.queue) return message.reply(", jono on tyhjä.");
        if (!this.queue[index - 1]) return this.message.reply(", kappaletta ei löytynyt!")
        await message.channel.send(`Kappale ${this.queue[index - 1].info.title} poistettu`)

        this.queue = this.queue.splice(index - 1, 1);
        return this
    }

    async playSkip(url, message) {
        this.queue = []
        await this.play(url, message)
        return this
    } 

    /**
     * Send player queue to channel
     * @param {Message} message 
     * @returns IlluminatiPlayer object
     */

    async sendQueue(message) {
        if(!this.queue) return message.reply(", jono on tyhjä. Pistä bileet pystyyn!");
        let fields = [];
        this.queue.forEach((song, i) => {
            fields.push({
                name: i + 1,
                value: `${song.info.title} - ${song.info.ownerChannelName}`
            })
        })

        new IlluminatiEmbed(message, {
            title: "Jono :notes:",
            fields
        }, this.client).send()

        return this
    }

    /**
     * @method
     * Skip currently playing song and play next from queue
     */

    async skip(message) {
        this.playing = false
        if(this.queue.length > 0) {
            await message.channel.send("Skipataan..")
            await this.play(this.queue[0].url, message)
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
